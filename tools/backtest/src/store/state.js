// State must be a function to avoiding shared object

export default () => ({
    merchandises: [
        {
            "id": 14,
            "slug": "BTC"
        },
        {
            "id": 15,
            "slug": "LTC"
        },
        {
            "id": 16,
            "slug": "BAT"
        },
        {
            "id": 17,
            "slug": "DOT"
        },
        {
            "id": 18,
            "slug": "XRP"
        },
    ],
    merchandiseRates: [
        {
            "id": 34,
            "slug": "BTCUSDT",
            "base_id": 14,
            "quote_id": 13
        },
        {
            "id": 35,
            "slug": "LTCUSDT",
            "base_id": 15,
            "quote_id": 13
        },
        {
            "id": 36,
            "slug": "BATUSDT",
            "base_id": 16,
            "quote_id": 13
        },
        {
            "id": 37,
            "slug": "DOTUSDT",
            "base_id": 17,
            "quote_id": 13
        },
        {
            "id": 38,
            "slug": "XRPUSDT",
            "base_id": 18,
            "quote_id": 13
        },
        {
            "id": 39,
            "slug": "DOTBTC",
            "base_id": 17,
            "quote_id": 14
        },
        {
            "id": 41,
            "slug": "LTCBTC",
            "base_id": 15,
            "quote_id": 14
        }
    ],
    intervals: {
        "day": 1,
        "week": 2,
        "month": 3,
        "hour": 4,
        "m15": 5
    }
})
