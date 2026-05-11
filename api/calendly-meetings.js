const CALENDLY_BASE = 'https://api.calendly.com';

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });

  const email = (req.query.email || '').trim().toLowerCase();
  if (!email || !/\S+@\S+\.\S+/.test(email)) {
    return res.status(400).json({ error: 'Valid email required' });
  }

  const PAT = process.env.CALENDLY_PAT;
  if (!PAT) return res.status(503).json({ error: 'Calendly not configured' });

  const headers = { Authorization: `Bearer ${PAT}`, 'Content-Type': 'application/json' };

  try {
    // 1. Get user/org URI
    const meRes = await fetch(`${CALENDLY_BASE}/users/me`, { headers });
    if (!meRes.ok) return res.status(502).json({ error: 'Calendly auth failed — check your PAT' });
    const { resource: user } = await meRes.json();
    const orgUri = user.current_organization;

    // 2. Get upcoming events for this invitee
    const params = new URLSearchParams({
      organization: orgUri,
      invitee_email: email,
      status: 'active',
      sort: 'start_time:asc',
      min_start_time: new Date().toISOString(),
      count: '20',
    });

    const eventsRes = await fetch(`${CALENDLY_BASE}/scheduled_events?${params}`, { headers });
    if (!eventsRes.ok) return res.status(502).json({ error: 'Could not fetch events from Calendly' });
    const { collection: events = [] } = await eventsRes.json();

    // 3. Enrich each event with cancel/reschedule URLs from the invitee record
    const enriched = await Promise.all(
      events.map(async (evt) => {
        try {
          const evtUuid = evt.uri.split('/').pop();
          const invRes = await fetch(
            `${CALENDLY_BASE}/scheduled_events/${evtUuid}/invitees?email=${encodeURIComponent(email)}&count=1`,
            { headers }
          );
          if (!invRes.ok) return evt;
          const { collection: invitees = [] } = await invRes.json();
          const inv = invitees[0];
          return { ...evt, cancelUrl: inv?.cancel_url || null, rescheduleUrl: inv?.reschedule_url || null };
        } catch {
          return evt;
        }
      })
    );

    return res.status(200).json({ meetings: enriched });
  } catch (err) {
    return res.status(500).json({ error: 'Server error' });
  }
};
