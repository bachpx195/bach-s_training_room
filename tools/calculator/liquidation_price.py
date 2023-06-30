standard_error_of_mean = (85.38/85.91 + 92.94/92.95)/2

# (max) position, maintenance margin, maintenance amount
maint_lookup_table = [
    (50_000,  0.4,           0),
    (250_000,  0.5,          50)
]

def liq_balance(wallet_balance, total, entry_price):
    for max_position, maint_margin_rate_pct, maint_amount in maint_lookup_table:
        quantity = total/entry_price
        maint_margin_rate = maint_margin_rate_pct / 100
        liq_price = (wallet_balance + maint_amount - total) / \
            (abs(quantity) * (maint_margin_rate - (1 if quantity >= 0 else -1)))
        base_balance = liq_price * abs(quantity )
        if base_balance <= max_position:
            break
    return round(liq_price*standard_error_of_mean, 2)


if __name__ == '__main__':
    import argparse
    parser = argparse.ArgumentParser()
    parser.add_argument('--wallet-balance', type=float, help='wallet balance in USDT')
    parser.add_argument('--contract-quantity', required=True, type=float, help='contract quantity in USDT, negative for shorts')
    parser.add_argument('--entry-price', required=True, type=float, help='entry price in USDT')
    options = parser.parse_args()
    print(liq_balance(options.wallet_balance,
            options.contract_quantity, options.entry_price))
