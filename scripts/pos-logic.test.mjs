// Run: yarn test  (Node 22.6+ strips the TS types itself)
import assert from 'node:assert/strict';
import { computeTotals, lineKey, quickCashOptions } from '../src/lib/cart.ts';
import encodeEscPos from '../src/lib/escpos.ts';
import applyKeypadKey from '../src/lib/keypad.ts';
import { defaultModifiers, missingRequiredGroup, toggleModifier } from '../src/lib/modifiers.ts';
import { formatNumber as money } from '../src/lib/money.ts';
import { buildReceiptLines, buildShiftReportLines } from '../src/lib/receipt.ts';

assert.equal(money(0), '0');
assert.equal(money(54000), '54.000');
assert.equal(money(1234567), '1.234.567');
assert.equal(money(-5000), '-5.000');

const line = (unitPrice, qty, deltas = []) => ({
  key: 'k', productId: 'p', name: 'x', unitPrice, qty, note: '',
  modifiers: deltas.map((d) => ({ optionId: 'o', groupId: 'g', name: 'm', priceDelta: d })),
});
assert.deepEqual(computeTotals([line(18000, 2), line(18000, 1, [3000])], null, 0), {
  subtotal: 57000, discountTotal: 0, taxTotal: 0, total: 57000,
});
assert.equal(computeTotals([line(10000, 1)], { id: 'd', name: 'P', type: 'percent', value: 10 }, 10).total, 9900);
assert.equal(computeTotals([line(3000, 1)], { id: 'd', name: 'P', type: 'amount', value: 5000 }, 0).total, 0); // never negative
assert.deepEqual(quickCashOptions(54000), [54000, 100000]);
assert.deepEqual(quickCashOptions(15000), [15000, 20000, 50000, 100000]);

const store = { name: 'Kopi Senja', address: 'Jl. Merdeka No. 12', phone: '', footer: 'Terima kasih!' };
const order = {
  orderNo: 42, createdAt: new Date(2026, 10, 19, 14, 5), cashier: 'Rina', orderType: 'take_away',
  items: [
    { name: 'Es Kopi Susu', qty: 2, lineTotal: 36000, modifiers: ['Less sugar'], note: '' },
    { name: 'Roti Bakar Coklat Keju Spesial Jumbo', qty: 1, lineTotal: 18000, modifiers: [], note: 'potong 4' },
  ],
  subtotal: 54000, discountName: null, discountTotal: 0, taxPercent: 0, taxTotal: 0, total: 54000,
  method: 'cash', cashReceived: 100000, change: 46000, isVoid: false,
};
for (const width of [32, 48]) {
  const lines = buildReceiptLines(store, order, width);
  for (const l of lines) assert.ok(l.length <= width, `line over ${width}: "${l}"`);
  assert.ok(lines.includes('Es Kopi Susu x2' + ' '.repeat(width - 21) + '36.000'));
  assert.ok(lines.some((l) => l.startsWith('Kembali') && l.endsWith('46.000')));
  assert.ok(lines.some((l) => l.endsWith('18.000'))); // long name wrapped, price still on a line
}
const report = buildShiftReportLines({
  storeName: 'Kopi Senja', cashier: 'Rina', openedAt: new Date(), closedAt: new Date(),
  orders: 3, voids: 1, cashSales: 80000, qrisSales: 20000, openingCash: 200000, countedCash: 275000,
}, 32);
assert.ok(report.some((l) => l.startsWith('Selisih') && l.endsWith('-5.000')));
for (const l of report) assert.ok(l.length <= 32, `report line over 32: "${l}"`);

const bytes = encodeEscPos(['Kopi é']);
assert.deepEqual([...bytes.slice(0, 2)], [0x1b, 0x40]);
assert.ok(bytes.includes(0x3f)); // é -> ?

assert.equal(lineKey('p', [{ optionId: 'b' }, { optionId: 'a' }], ''), lineKey('p', [{ optionId: 'a' }, { optionId: 'b' }], ''));
assert.equal(applyKeypadKey('0', '1', { keepLeadingZeros: true }), '01'); // PIN
assert.equal(applyKeypadKey('', '0'), ''); // amount
assert.equal(applyKeypadKey('5', '000'), '5000');
assert.equal(applyKeypadKey('123', 'backspace'), '12');

const opt = (id, isDefault = false) => ({ id, name: id, priceDelta: 0, isDefault });
const size = { id: 'size', required: true, maxSelect: 1, options: [opt('reg', true), opt('lg')] };
const top = { id: 'top', required: false, maxSelect: 2, options: [opt('boba'), opt('keju'), opt('shot')] };
let picked = defaultModifiers([size, top]);
assert.deepEqual(picked.map((m) => m.optionId), ['reg']);
assert.equal(toggleModifier(picked, size, size.options[0]), picked); // required group cannot be emptied
picked = toggleModifier(picked, size, size.options[1]);
assert.deepEqual(picked.map((m) => m.optionId), ['lg']); // single choice replaces
for (const o of top.options) picked = toggleModifier(picked, top, o);
assert.deepEqual(picked.map((m) => m.optionId), ['lg', 'boba', 'keju']); // capped at maxSelect 2
assert.equal(missingRequiredGroup([], [size, top]), true);
assert.equal(missingRequiredGroup(picked, [size, top]), false);

console.log(buildReceiptLines(store, order, 32).join('\n'));
console.log('\npos logic tests ok');
