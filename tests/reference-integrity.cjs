const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const root = path.join(__dirname, '..');
const context = {};
context.window = context;
vm.createContext(context);
for (const file of ['data.js', 'catalog.js', 'gas-cases.js', 'firework-cases.js']) {
  vm.runInContext(fs.readFileSync(path.join(root, file), 'utf8'), context);
}
const cases = context.CASES;
const fireworks = cases.filter(c => c.group === '爆竹煙火');
assert.equal(cases.length, 53);
assert.equal(new Set(cases.map(c => c.id)).size, cases.length);
assert.equal(fireworks.length, 32);
assert.equal(fireworks.filter(c => c.file).length, 18);
for (const c of fireworks) {
  for (const field of ['proof', 'steps', 'interview', 'sources']) assert.ok(c[field].length, `${c.id}: ${field}`);
  assert.ok(c.sources.includes(c.exampleSource), c.id);
  assert.ok(context.SOURCE_CATALOG.some(s => c.exampleSource.includes(s.id) && s.read), c.id);
  if (!c.file) assert.ok(c.sourceKind.startsWith('法條對照表'), c.id);
}
const expected = {
  '01': '1kAacBKY63dNz0qO4_euRdsunw0jcKXez',
  '02 持有': '1fLtCB0HECqF5370CpRax-RI-_8OIgR3n',
  '02 販賣': '1vNKW3hfpUCqk-fWHPOUzuN7BS6ZqrV60',
  '03': '1WCRJxu5bxUv8VucIJbrd3FbZUzJxqdyR',
  '04': '1x-M7qmKCuhZwj37m3f2Lhg7Uq6QiQuj6',
  '11-1': '1r7_tSDtlaC74aqDtcCm8WG5nI3r02hEV',
  '11-2': '1NFhwOCUpkULw2r11Fqng5B0KWJtU8aNd',
  '11-3': '1DkOS8FZ-PerqRQF2p0rFWIPaxCOX30TT',
  '12-1': '1I_Pk6xUoF0BBPX9tJN-tG2-puPh7mbKg',
  '12-2': '1eBuqrWEvlYjzkzxDxwoP43maui73FyDq',
  '12-3': '1lmk5hNWTk25ACdZ7sKe_xwAtXBipmVGR',
  '12-4': '1xv3lZZDaxBZyEq7g-9vnbmvRQdPxjgpL',
  '21': '1NsCMufJG4N5gwOVkMQGvgOE_mbDl19z2',
  '22': '1MQJPCb8VBgsoOEBw4m4ggEJVNwRxxDiy',
  '23': '10EzOyW6O3TPcz7Rj3hSLh5GQO1yVF_cs',
  '24': '1nkAuXtrlzctdMrgqExqfHSOFdDPJzcW0',
  '25': '1gdYNNSZoyFUFgYRqr3GTsoZ6-M0GwWbf',
  '26': '164O6nlamMtQkWgr4NSzezQlnFIvbtKXf'
};
for (const [code, id] of Object.entries(expected)) {
  assert.equal(fireworks.find(c => c.code === code).exampleSource, `https://drive.google.com/file/d/${id}/view`, code);
}
const find = id => fireworks.find(c => c.id === id);
assert.match(find('fw-pro-permit').penalty, /第 29 條第 1 項第 5 款/);
assert.match(find('fw-supervisor').violation, /第 18 條第 1 項/);
for (const id of ['fw-11-2', 'fw-12-2']) {
  assert.equal(find(id).route, 'both');
  assert.match(find(id).penalty, /第 28 條第 1 項第 2 款/);
}
assert.equal(find('fw-local').route, 'review');
assert.equal(context.FIREWORK_GUIDE.ids.filter(id => context.SOURCE_CATALOG.some(s => s.id === id && s.read)).length, 22);
assert.equal(cases.filter(c => c.group === '液化石油氣').length, 10);
console.log('Passed: 53 unique cases, 32 firework scenarios, 18 source mappings, 22 read files, key routing and LPG regression.');
