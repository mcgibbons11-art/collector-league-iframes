/* Collector League — shared API client for the iframes. Talks to the Cloudflare Worker.
 * Set the Worker URL one of three ways (first wins):
 *   1. ?api=https://collector-league.<you>.workers.dev  on the iframe URL (the room passes this)
 *   2. localStorage 'cl_api'
 *   3. the CL_API_DEFAULT constant below (edit after `wrangler deploy`)
 * Runs in a normal browser page, so Date.now()/Math.random() are fine here (not the Portals sandbox). */
(function () {
  var CL_API_DEFAULT = 'https://collector-league.REPLACE-ME.workers.dev';
  var qp = new URLSearchParams(location.search);
  if (qp.get('api')) localStorage.setItem('cl_api', qp.get('api'));
  var BASE = (qp.get('api') || localStorage.getItem('cl_api') || CL_API_DEFAULT).replace(/\/$/, '');
  var configured = BASE.indexOf('REPLACE-ME') < 0;

  function api(path, opts) {
    return fetch(BASE + path, opts).then(function (r) { return r.json(); });
  }
  function post(path, body) {
    return api(path, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(body) });
  }

  var player = null;
  function createPlayer() {
    var name = localStorage.getItem('cl_player_name')
      || (window.PortalsSdk && PortalsSdk.playerName) || 'Collector';
    var key = localStorage.getItem('cl_portals_key');
    if (!key) { key = 'k_' + Math.random().toString(36).slice(2) + Date.now().toString(36); localStorage.setItem('cl_portals_key', key); }
    return post('/player', { display_name: name, portals_key: key }).then(function (p) {
      if (p && p.id) { localStorage.setItem('cl_player_id', p.id); localStorage.setItem('cl_player_name', p.display_name); player = p; }
      return p;
    });
  }
  function ensurePlayer() {
    var id = localStorage.getItem('cl_player_id');
    if (!id) return createPlayer();
    return api('/player?id=' + encodeURIComponent(id)).then(function (p) {
      if (p && p.id) { player = p; return p; }
      return createPlayer();
    });
  }

  // Map an API card {name,img,rarity,value} into the cl-kit.js card-view shape.
  function cardView(c) {
    var R = (window.CL && window.CL.RAR) || { EPIC: ['Epic', 'F5B400'], RARE: ['Rare', '7A52F0'], UNCOMMON: ['Uncommon', '3B7DF0'], COMMON: ['Common', '8A94A6'] };
    var r = R[c.rarity] || R.COMMON;
    return {
      id: c.id, card_id: c.card_id, name: c.name,
      img: 'https://images.pokemontcg.io/' + c.img + '_hires.png',
      rarityKey: c.rarity, rarity: r[0], rarityColor: r[1],
      value: c.value, valueLabel: '$' + (c.value || 0).toLocaleString(),
    };
  }

  window.CLAPI = {
    base: BASE,
    configured: configured,
    player: function () { return player; },
    ensurePlayer: ensurePlayer,
    cardView: cardView,
    machines: function () { return api('/machines'); },
    buy: function (machine) { return post('/buy', { player_id: player.id, machine: machine }); },
    collection: function () { return api('/collection?player_id=' + player.id); },
    rips: function (limit) { return api('/rips?limit=' + (limit || 15)); },
    state: function () { return api('/state'); },
    season: function () { return api('/season'); },
    standings: function () { return api('/standings'); },
    results: function () { return api('/results'); },
    lineup: function () { return api('/lineup?player_id=' + player.id); },
    lockLineup: function (ids) { return post('/lineup', { player_id: player.id, collectible_ids: ids, lock: true }); },
    saveLineup: function (ids) { return post('/lineup', { player_id: player.id, collectible_ids: ids, lock: false }); },
  };
})();
