"use strict";
class POS {
    constructor(items, buyers, transactions) {
        this.items = new Map();
        this.buyers = new Map();
        this.transactions = [];
        items.forEach(item => this.items.set(item.name, item));
        buyers.forEach(buyer => this.buyers.set(buyer.name, buyer));
        this.transactions = transactions;
    }
    generateSummary() {
        var _a, _b;
        const revenueByCategory = new Map([
            ['hats', 0],
            ['tops', 0],
            ['shorts', 0]
        ]);
        const itemSales = new Map();
        const buyerSpending = new Map();
        const uniqueItems = new Set();
        const uniqueBuyers = new Set();
        for (const transaction of this.transactions) {
            const { item, qty, buyer } = transaction;
            const itemData = this.items.get(item);
            const buyerData = this.buyers.get(buyer);
            if (!itemData || !buyerData) {
                console.log(`Error: Item or buyer not found: ${item}, ${buyer}`);
                return;
            }
            if (uniqueItems.has(item) && uniqueBuyers.has(buyer)) {
                console.log(`Error: Duplicate item in transactions: ${item} for buyer ${buyer}`);
                return;
            }
            uniqueItems.add(item);
            uniqueBuyers.add(buyer);
            let price = (_a = itemData.prices.find(p => p.priceFor === buyerData.type)) === null || _a === void 0 ? void 0 : _a.price;
            if (price === undefined) {
                price = (_b = itemData.prices.find(p => p.priceFor === 'regular')) === null || _b === void 0 ? void 0 : _b.price;
            }
            if (price === undefined) {
                console.log(`Error: Item ${item} does not have a price for any buyer.`);
                return;
            }
            const totalCost = price * qty;
            revenueByCategory.set(itemData.type, revenueByCategory.get(itemData.type) + totalCost);
            itemSales.set(item, (itemSales.get(item) || 0) + qty);
            const buyerSpend = buyerSpending.get(buyer) || { type: buyerData.type, spent: 0 };
            buyerSpend.spent += totalCost;
            buyerSpending.set(buyer, buyerSpend);
        }
        const totalTransaction = this.transactions.length;
        const bestSellingItem = [...itemSales.entries()].reduce((max, entry) => entry[1] > max[1] ? entry : max, ['', 0])[0];
        const bestSellingCategory = [...revenueByCategory.entries()].reduce((max, entry) => entry[1] > max[1] ? entry : max, ['hats', 0])[0];
        const totalRevenue = [...revenueByCategory.values()].reduce((a, b) => a + b, 0);
        const bestSpenders = [...buyerSpending.entries()]
            .map(([name, { type, spent }]) => ({ name, type, spent }))
            .sort((a, b) => b.spent - a.spent)
            .slice(0, 3);
        console.log({
            totalTransaction,
            bestSellingItem,
            bestSellingCategory,
            rpc: [...revenueByCategory.entries()].map(([category, revenue]) => ({ category, revenue })),
            revenue: totalRevenue,
            bestSpenders
        });
    }
}
const input = {
    Items: [
        {
            name: "oval hat",
            type: "hats",
            prices: [{ priceFor: "regular", price: 20000 }, { priceFor: "VIP", price: 15000 }]
        },
        {
            name: "square hat",
            type: "hats",
            prices: [
                { priceFor: "regular", price: 30000 },
                { priceFor: "VIP", price: 20000 },
                { priceFor: "wholesale", price: 15000 }
            ]
        },
        {
            name: "magic shirt",
            type: "tops",
            prices: [{ priceFor: "regular", price: 50000 }]
        }
    ],
    Buyers: [
        { name: "Ani", type: "regular" },
        { name: "Budi", type: "VIP" },
        { name: "Charlie", type: "regular" },
        { name: "Dipta", type: "wholesale" }
    ],
    Transaction: [
        { item: "magic shirt", qty: 2, buyer: "Ani" },
        { item: "square hat", qty: 2, buyer: "Budi" },
        { item: "oval hat", qty: 1, buyer: "Ani" },
        { item: "square hat", qty: 100, buyer: "Dipta" }
    ]
};
const pos = new POS(input.Items, input.Buyers, input.Transaction);
pos.generateSummary();
