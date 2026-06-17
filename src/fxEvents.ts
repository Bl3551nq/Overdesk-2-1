export interface FxEvent {
  title: string;
  country: string;
  date: string; // ISO format: e.g. 2026-06-17T19:00:00+01:00
  impact: 'High' | 'Medium' | 'Low' | 'Holiday' | 'Non-Econ';
  forecast: string;
  previous: string;
  actual: string;
}

export const FX_EVENTS: FxEvent[] = [
  {
    "title": "BusinessNZ Services Index",
    "country": "NZD",
    "date": "2026-06-14T23:30:00+01:00",
    "impact": "Low",
    "forecast": "",
    "previous": "48.7",
    "actual": "47.5"
  },
  {
    "title": "Rightmove HPI m/m",
    "country": "GBP",
    "date": "2026-06-15T00:01:00+01:00",
    "impact": "Low",
    "forecast": "",
    "previous": "1.2%",
    "actual": "-0.6%"
  },
  {
    "title": "Tertiary Industry Activity m/m",
    "country": "JPY",
    "date": "2026-06-15T05:30:00+01:00",
    "impact": "Low",
    "forecast": "0.5%",
    "previous": "-0.6%",
    "actual": "1.3%"
  },
  {
    "title": "German WPI m/m",
    "country": "EUR",
    "date": "2026-06-15T07:00:00+01:00",
    "impact": "Low",
    "forecast": "0.8%",
    "previous": "2.0%",
    "actual": "-0.6%"
  },
  {
    "title": "PPI m/m",
    "country": "CHF",
    "date": "2026-06-15T07:30:00+01:00",
    "impact": "Low",
    "forecast": "0.4%",
    "previous": "0.8%",
    "actual": "-0.4%"
  },
  {
    "title": "SECO Consumer Climate",
    "country": "CHF",
    "date": "2026-06-15T08:00:00+01:00",
    "impact": "Low",
    "forecast": "-38",
    "previous": "-40",
    "actual": "-38"
  },
  {
    "title": "German Buba President Nagel Speaks",
    "country": "EUR",
    "date": "2026-06-15T08:00:00+01:00",
    "impact": "Low",
    "forecast": "",
    "previous": "",
    "actual": ""
  },
  {
    "title": "ECB President Lagarde Speaks",
    "country": "EUR",
    "date": "2026-06-15T08:30:00+01:00",
    "impact": "Medium",
    "forecast": "",
    "previous": "",
    "actual": ""
  },
  {
    "title": "Italian Trade Balance",
    "country": "EUR",
    "date": "2026-06-15T09:00:00+01:00",
    "impact": "Low",
    "forecast": "5.19B",
    "previous": "4.81B",
    "actual": "4.29B"
  },
  {
    "title": "G7 Meetings",
    "country": "USD",
    "date": "2026-06-15T09:00:00+01:00",
    "impact": "Low",
    "forecast": "",
    "previous": "",
    "actual": ""
  },
  {
    "title": "Industrial Production m/m",
    "country": "EUR",
    "date": "2026-06-15T10:00:00+01:00",
    "impact": "Low",
    "forecast": "0.2%",
    "previous": "0.4%",
    "actual": "0.1%"
  },
  {
    "title": "Trade Balance",
    "country": "EUR",
    "date": "2026-06-15T10:00:00+01:00",
    "impact": "Low",
    "forecast": "7.8B",
    "previous": "0.6B",
    "actual": "1.3B"
  },
  {
    "title": "Housing Starts",
    "country": "CAD",
    "date": "2026-06-15T13:15:00+01:00",
    "impact": "Low",
    "forecast": "255K",
    "previous": "278K",
    "actual": "261K"
  },
  {
    "title": "Manufacturing Sales m/m",
    "country": "CAD",
    "date": "2026-06-15T13:30:00+01:00",
    "impact": "Low",
    "forecast": "4.4%",
    "previous": "3.4%",
    "actual": "4.2%"
  },
  {
    "title": "Wholesale Sales m/m",
    "country": "CAD",
    "date": "2026-06-15T13:30:00+01:00",
    "impact": "Low",
    "forecast": "0.2%",
    "previous": "1.6%",
    "actual": "0.6%"
  },
  {
    "title": "Empire State Manufacturing Index",
    "country": "USD",
    "date": "2026-06-15T13:30:00+01:00",
    "impact": "Low",
    "forecast": "13.2",
    "previous": "19.6",
    "actual": "5.7"
  },
  {
    "title": "Capacity Utilization Rate",
    "country": "USD",
    "date": "2026-06-15T14:15:00+01:00",
    "impact": "Low",
    "forecast": "76.2%",
    "previous": "76.1%",
    "actual": "76.2%"
  },
  {
    "title": "Industrial Production m/m",
    "country": "USD",
    "date": "2026-06-15T14:15:00+01:00",
    "impact": "Low",
    "forecast": "0.3%",
    "previous": "0.9%",
    "actual": "0.1%"
  },
  {
    "title": "NAHB Housing Market Index",
    "country": "USD",
    "date": "2026-06-15T15:00:00+01:00",
    "impact": "Low",
    "forecast": "36",
    "previous": "37",
    "actual": "35"
  },
  {
    "title": "FPI m/m",
    "country": "NZD",
    "date": "2026-06-15T23:45:00+01:00",
    "impact": "Low",
    "forecast": "",
    "previous": "0.0%",
    "actual": "1.0%"
  },
  {
    "title": "New Home Prices m/m",
    "country": "CNY",
    "date": "2026-06-16T02:30:00+01:00",
    "impact": "Low",
    "forecast": "",
    "previous": "-0.19%",
    "actual": "-0.20%"
  },
  {
    "title": "Fixed Asset Investment ytd/y",
    "country": "CNY",
    "date": "2026-06-16T03:00:00+01:00",
    "impact": "Low",
    "forecast": "-2.3%",
    "previous": "-1.6%",
    "actual": "-4.1%"
  },
  {
    "title": "Industrial Production y/y",
    "country": "CNY",
    "date": "2026-06-16T03:00:00+01:00",
    "impact": "Low",
    "forecast": "4.4%",
    "previous": "4.1%",
    "actual": "4.5%"
  },
  {
    "title": "NBS Press Conference",
    "country": "CNY",
    "date": "2026-06-16T03:00:00+01:00",
    "impact": "Low",
    "forecast": "",
    "previous": "",
    "actual": ""
  },
  {
    "title": "Retail Sales y/y",
    "country": "CNY",
    "date": "2026-06-16T03:00:00+01:00",
    "impact": "Low",
    "forecast": "-0.3%",
    "previous": "0.2%",
    "actual": "-0.6%"
  },
  {
    "title": "Unemployment Rate",
    "country": "CNY",
    "date": "2026-06-16T03:00:00+01:00",
    "impact": "Low",
    "forecast": "5.2%",
    "previous": "5.2%",
    "actual": "5.1%"
  },
  {
    "title": "BOJ Policy Rate",
    "country": "JPY",
    "date": "2026-06-16T04:19:00+01:00",
    "impact": "High",
    "forecast": "<1.00%",
    "previous": "<0.75%",
    "actual": "<1.00%"
  },
  {
    "title": "Monetary Policy Statement",
    "country": "JPY",
    "date": "2026-06-16T04:19:00+01:00",
    "impact": "High",
    "forecast": "",
    "previous": "",
    "actual": ""
  },
  {
    "title": "Cash Rate",
    "country": "AUD",
    "date": "2026-06-16T05:30:00+01:00",
    "impact": "High",
    "forecast": "4.35%",
    "previous": "4.35%",
    "actual": "4.35%"
  },
  {
    "title": "RBA Rate Statement",
    "country": "AUD",
    "date": "2026-06-16T05:30:00+01:00",
    "impact": "High",
    "forecast": "",
    "previous": "",
    "actual": ""
  },
  {
    "title": "RBA Press Conference",
    "country": "AUD",
    "date": "2026-06-16T06:30:00+01:00",
    "impact": "High",
    "forecast": "",
    "previous": "",
    "actual": ""
  },
  {
    "title": "BOJ Press Conference",
    "country": "JPY",
    "date": "2026-06-16T07:30:00+01:00",
    "impact": "High",
    "forecast": "",
    "previous": "",
    "actual": ""
  },
  {
    "title": "G7 Meetings",
    "country": "USD",
    "date": "2026-06-16T07:30:00+01:00",
    "impact": "Low",
    "forecast": "",
    "previous": "",
    "actual": ""
  },
  {
    "title": "German ZEW Economic Sentiment",
    "country": "EUR",
    "date": "2026-06-16T10:00:00+01:00",
    "impact": "Low",
    "forecast": "-5.8",
    "previous": "-10.2",
    "actual": "10.5"
  },
  {
    "title": "ZEW Economic Sentiment",
    "country": "EUR",
    "date": "2026-06-16T10:00:00+01:00",
    "impact": "Low",
    "forecast": "-7.2",
    "previous": "-9.1",
    "actual": "9.5"
  },
  {
    "title": "10-y Bond Auction",
    "country": "GBP",
    "date": "2026-06-16T10:02:00+01:00",
    "impact": "Low",
    "forecast": "",
    "previous": "4.98|3.6",
    "actual": "4.86|3.5"
  },
  {
    "title": "ADP Weekly Employment Change",
    "country": "USD",
    "date": "2026-06-16T13:15:00+01:00",
    "impact": "Low",
    "forecast": "",
    "previous": "29.0K",
    "actual": "25.5K"
  },
  {
    "title": "Foreign Securities Purchases",
    "country": "CAD",
    "date": "2026-06-16T13:30:00+01:00",
    "impact": "Low",
    "forecast": "8.16B",
    "previous": "4.40B",
    "actual": "46.91B"
  },
  {
    "title": "Building Permits",
    "country": "USD",
    "date": "2026-06-16T13:30:00+01:00",
    "impact": "Low",
    "forecast": "1.42M",
    "previous": "1.42M",
    "actual": "1.41M"
  },
  {
    "title": "Housing Starts",
    "country": "USD",
    "date": "2026-06-16T13:30:00+01:00",
    "impact": "Low",
    "forecast": "1.43M",
    "previous": "1.39M",
    "actual": "1.18M"
  },
  {
    "title": "Import Prices m/m",
    "country": "USD",
    "date": "2026-06-16T13:30:00+01:00",
    "impact": "Low",
    "forecast": "0.9%",
    "previous": "2.0%",
    "actual": "1.9%"
  },
  {
    "title": "GDT Price Index",
    "country": "NZD",
    "date": "2026-06-16T16:14:00+01:00",
    "impact": "Low",
    "forecast": "",
    "previous": "-0.6%",
    "actual": "-2.8%"
  },
  {
    "title": "API Weekly Statistical Bulletin",
    "country": "USD",
    "date": "2026-06-16T21:30:00+01:00",
    "impact": "Low",
    "forecast": "",
    "previous": "",
    "actual": ""
  },
  {
    "title": "Westpac Consumer Sentiment",
    "country": "NZD",
    "date": "2026-06-16T22:00:00+01:00",
    "impact": "Low",
    "forecast": "",
    "previous": "94.7",
    "actual": "80.4"
  },
  {
    "title": "Current Account",
    "country": "NZD",
    "date": "2026-06-16T23:45:00+01:00",
    "impact": "Low",
    "forecast": "-1.01B",
    "previous": "-5.64B",
    "actual": "-1.01B"
  },
  {
    "title": "Core Machinery Orders m/m",
    "country": "JPY",
    "date": "2026-06-17T00:50:00+01:00",
    "impact": "Low",
    "forecast": "1.2%",
    "previous": "-9.4%",
    "actual": "8.7%"
  },
  {
    "title": "Trade Balance",
    "country": "JPY",
    "date": "2026-06-17T00:50:00+01:00",
    "impact": "Low",
    "forecast": "-0.21T",
    "previous": "0.20T",
    "actual": "-0.09T"
  },
  {
    "title": "MI Leading Index m/m",
    "country": "AUD",
    "date": "2026-06-17T01:30:00+01:00",
    "impact": "Low",
    "forecast": "",
    "previous": "0.1%",
    "actual": "0.0%"
  },
  {
    "title": "RBA Assist Gov Jones Speaks",
    "country": "AUD",
    "date": "2026-06-17T02:30:00+01:00",
    "impact": "Low",
    "forecast": "",
    "previous": "",
    "actual": ""
  },
  {
    "title": "CPI y/y",
    "country": "GBP",
    "date": "2026-06-17T07:00:00+01:00",
    "impact": "High",
    "forecast": "3.0%",
    "previous": "2.8%",
    "actual": ""
  },
  {
    "title": "Core CPI y/y",
    "country": "GBP",
    "date": "2026-06-17T07:00:00+01:00",
    "impact": "Low",
    "forecast": "2.7%",
    "previous": "2.5%",
    "actual": ""
  },
  {
    "title": "PPI Input m/m",
    "country": "GBP",
    "date": "2026-06-17T07:00:00+01:00",
    "impact": "Low",
    "forecast": "0.5%",
    "previous": "2.4%",
    "actual": ""
  },
  {
    "title": "PPI Output m/m",
    "country": "GBP",
    "date": "2026-06-17T07:00:00+01:00",
    "impact": "Low",
    "forecast": "0.5%",
    "previous": "1.4%",
    "actual": ""
  },
  {
    "title": "RPI y/y",
    "country": "GBP",
    "date": "2026-06-17T07:00:00+01:00",
    "impact": "Low",
    "forecast": "3.3%",
    "previous": "3.0%",
    "actual": ""
  },
  {
    "title": "HPI y/y",
    "country": "GBP",
    "date": "2026-06-17T09:30:00+01:00",
    "impact": "Low",
    "forecast": "2.8%",
    "previous": "0.0%",
    "actual": ""
  },
  {
    "title": "G7 Meetings",
    "country": "USD",
    "date": "2026-06-17T09:30:00+01:00",
    "impact": "Low",
    "forecast": "",
    "previous": "",
    "actual": ""
  },
  {
    "title": "Final Core CPI y/y",
    "country": "EUR",
    "date": "2026-06-17T10:00:00+01:00",
    "impact": "Low",
    "forecast": "2.5%",
    "previous": "2.5%",
    "actual": ""
  },
  {
    "title": "Final CPI y/y",
    "country": "EUR",
    "date": "2026-06-17T10:00:00+01:00",
    "impact": "Low",
    "forecast": "3.2%",
    "previous": "3.2%",
    "actual": ""
  },
  {
    "title": "ECB President Lagarde Speaks",
    "country": "EUR",
    "date": "2026-06-17T11:50:00+01:00",
    "impact": "Medium",
    "forecast": "",
    "previous": "",
    "actual": ""
  },
  {
    "title": "NHPI m/m",
    "country": "CAD",
    "date": "2026-06-17T13:30:00+01:00",
    "impact": "Low",
    "forecast": "-0.1%",
    "previous": "-0.4%",
    "actual": ""
  },
  {
    "title": "Core Retail Sales m/m",
    "country": "USD",
    "date": "2026-06-17T13:30:00+01:00",
    "impact": "Medium",
    "forecast": "0.6%",
    "previous": "0.7%",
    "actual": ""
  },
  {
    "title": "Retail Sales m/m",
    "country": "USD",
    "date": "2026-06-17T13:30:00+01:00",
    "impact": "Medium",
    "forecast": "0.5%",
    "previous": "0.5%",
    "actual": ""
  },
  {
    "title": "President Trump Speaks",
    "country": "USD",
    "date": "2026-06-17T14:30:00+01:00",
    "impact": "Medium",
    "forecast": "",
    "previous": "",
    "actual": ""
  },
  {
    "title": "Business Inventories m/m",
    "country": "USD",
    "date": "2026-06-17T15:00:00+01:00",
    "impact": "Low",
    "forecast": "0.5%",
    "previous": "0.9%",
    "actual": ""
  },
  {
    "title": "Pending Home Sales m/m",
    "country": "USD",
    "date": "2026-06-17T15:00:00+01:00",
    "impact": "Low",
    "forecast": "0.8%",
    "previous": "1.4%",
    "actual": ""
  },
  {
    "title": "Crude Oil Inventories",
    "country": "USD",
    "date": "2026-06-17T15:30:00+01:00",
    "impact": "Low",
    "forecast": "-3.6M",
    "previous": "-7.2M",
    "actual": ""
  },
  {
    "title": "Federal Funds Rate",
    "country": "USD",
    "date": "2026-06-17T19:00:00+01:00",
    "impact": "High",
    "forecast": "3.75%",
    "previous": "3.75%",
    "actual": ""
  },
  {
    "title": "FOMC Economic Projections",
    "country": "USD",
    "date": "2026-06-17T19:00:00+01:00",
    "impact": "High",
    "forecast": "",
    "previous": "",
    "actual": ""
  },
  {
    "title": "FOMC Statement",
    "country": "USD",
    "date": "2026-06-17T19:00:00+01:00",
    "impact": "High",
    "forecast": "",
    "previous": "",
    "actual": ""
  },
  {
    "title": "FOMC Press Conference",
    "country": "USD",
    "date": "2026-06-17T19:30:00+01:00",
    "impact": "High",
    "forecast": "",
    "previous": "",
    "actual": ""
  },
  {
    "title": "GDP q/q",
    "country": "NZD",
    "date": "2026-06-17T23:45:00+01:00",
    "impact": "High",
    "forecast": "0.8%",
    "previous": "0.2%",
    "actual": ""
  },
  {
    "title": "Claimant Count Change",
    "country": "GBP",
    "date": "2026-06-18T07:00:00+01:00",
    "impact": "High",
    "forecast": "25.8K",
    "previous": "26.5K",
    "actual": ""
  },
  {
    "title": "Average Earnings Index 3m/y",
    "country": "GBP",
    "date": "2026-06-18T07:00:00+01:00",
    "impact": "Medium",
    "forecast": "4.0%",
    "previous": "4.1%",
    "actual": ""
  },
  {
    "title": "Unemployment Rate",
    "country": "GBP",
    "date": "2026-06-18T07:00:00+01:00",
    "impact": "Low",
    "forecast": "5.0%",
    "previous": "5.0%",
    "actual": ""
  },
  {
    "title": "SECO Economic Forecasts",
    "country": "CHF",
    "date": "2026-06-18T08:00:00+01:00",
    "impact": "Low",
    "forecast": "",
    "previous": "",
    "actual": ""
  },
  {
    "title": "German Buba President Nagel Speaks",
    "country": "EUR",
    "date": "2026-06-18T08:00:00+01:00",
    "impact": "Low",
    "forecast": "",
    "previous": "",
    "actual": ""
  },
  {
    "title": "SNB Monetary Policy Assessment",
    "country": "CHF",
    "date": "2026-06-18T08:30:00+01:00",
    "impact": "High",
    "forecast": "",
    "previous": "",
    "actual": ""
  },
  {
    "title": "SNB Policy Rate",
    "country": "CHF",
    "date": "2026-06-18T08:30:00+01:00",
    "impact": "High",
    "forecast": "0.00%",
    "previous": "0.00%",
    "actual": ""
  },
  {
    "title": "SNB Press Conference",
    "country": "CHF",
    "date": "2026-06-18T09:00:00+01:00",
    "impact": "High",
    "forecast": "",
    "previous": "",
    "actual": ""
  },
  {
    "title": "Current Account",
    "country": "EUR",
    "date": "2026-06-18T09:00:00+01:00",
    "impact": "Low",
    "forecast": "18.5B",
    "previous": "14.9B",
    "actual": ""
  },
  {
    "title": "Spanish 10-y Bond Auction",
    "country": "EUR",
    "date": "2026-06-18T09:00:00+01:00",
    "impact": "Low",
    "forecast": "",
    "previous": "3.39|2.1",
    "actual": ""
  },
  {
    "title": "German Buba Monthly Report",
    "country": "EUR",
    "date": "2026-06-18T11:00:00+01:00",
    "impact": "Low",
    "forecast": "",
    "previous": "",
    "actual": ""
  },
  {
    "title": "Monetary Policy Summary",
    "country": "GBP",
    "date": "2026-06-18T12:00:00+01:00",
    "impact": "High",
    "forecast": "",
    "previous": "",
    "actual": ""
  },
  {
    "title": "MPC Official Bank Rate Votes",
    "country": "GBP",
    "date": "2026-06-18T12:00:00+01:00",
    "impact": "High",
    "forecast": "1-0-8",
    "previous": "1-0-8",
    "actual": ""
  },
  {
    "title": "Official Bank Rate",
    "country": "GBP",
    "date": "2026-06-18T12:00:00+01:00",
    "impact": "High",
    "forecast": "3.75%",
    "previous": "3.75%",
    "actual": ""
  },
  {
    "title": "IPPI m/m",
    "country": "CAD",
    "date": "2026-06-18T13:30:00+01:00",
    "impact": "Low",
    "forecast": "1.3%",
    "previous": "2.0%",
    "actual": ""
  },
  {
    "title": "RMPI m/m",
    "country": "CAD",
    "date": "2026-06-18T13:30:00+01:00",
    "impact": "Low",
    "forecast": "1.1%",
    "previous": "2.6%",
    "actual": ""
  },
  {
    "title": "Philly Fed Manufacturing Index",
    "country": "USD",
    "date": "2026-06-18T13:30:00+01:00",
    "impact": "Medium",
    "forecast": "9.8",
    "previous": "-0.4",
    "actual": ""
  },
  {
    "title": "Unemployment Claims",
    "country": "USD",
    "date": "2026-06-18T13:30:00+01:00",
    "impact": "Medium",
    "forecast": "225K",
    "previous": "229K",
    "actual": ""
  },
  {
    "title": "CB Leading Index m/m",
    "country": "USD",
    "date": "2026-06-18T15:00:00+01:00",
    "impact": "Low",
    "forecast": "0.1%",
    "previous": "0.1%",
    "actual": ""
  },
  {
    "title": "Natural Gas Storage",
    "country": "USD",
    "date": "2026-06-18T15:30:00+01:00",
    "impact": "Low",
    "forecast": "82B",
    "previous": "108B",
    "actual": ""
  },
  {
    "title": "TIC Long-Term Purchases",
    "country": "USD",
    "date": "2026-06-18T21:00:00+01:00",
    "impact": "Low",
    "forecast": "72.5B",
    "previous": "81.3B",
    "actual": ""
  },
  {
    "title": "Trade Balance",
    "country": "NZD",
    "date": "2026-06-18T23:45:00+01:00",
    "impact": "Low",
    "forecast": "875M",
    "previous": "1920M",
    "actual": ""
  },
  {
    "title": "GfK Consumer Confidence",
    "country": "GBP",
    "date": "2026-06-19T00:01:00+01:00",
    "impact": "Low",
    "forecast": "-23",
    "previous": "-23",
    "actual": ""
  },
  {
    "title": "Bank Holiday",
    "country": "CNY",
    "date": "2026-06-19T00:01:00+01:00",
    "impact": "Holiday",
    "forecast": "",
    "previous": "",
    "actual": ""
  },
  {
    "title": "National Core CPI y/y",
    "country": "JPY",
    "date": "2026-06-19T00:30:00+01:00",
    "impact": "Low",
    "forecast": "1.4%",
    "previous": "1.4%",
    "actual": ""
  },
  {
    "title": "Monetary Policy Meeting Minutes",
    "country": "JPY",
    "date": "2026-06-19T00:50:00+01:00",
    "impact": "Low",
    "forecast": "",
    "previous": "",
    "actual": ""
  },
  {
    "title": "German PPI m/m",
    "country": "EUR",
    "date": "2026-06-19T07:00:00+01:00",
    "impact": "Low",
    "forecast": "0.7%",
    "previous": "1.2%",
    "actual": ""
  },
  {
    "title": "Retail Sales m/m",
    "country": "GBP",
    "date": "2026-06-19T07:00:00+01:00",
    "impact": "Medium",
    "forecast": "0.5%",
    "previous": "-1.3%",
    "actual": ""
  },
  {
    "title": "Public Sector Net Borrowing",
    "country": "GBP",
    "date": "2026-06-19T07:00:00+01:00",
    "impact": "Low",
    "forecast": "19.0B",
    "previous": "24.3B",
    "actual": ""
  },
  {
    "title": "Bank Holiday",
    "country": "USD",
    "date": "2026-06-19T07:00:00+01:00",
    "impact": "Holiday",
    "forecast": "",
    "previous": "",
    "actual": ""
  },
  {
    "title": "Core Retail Sales m/m",
    "country": "CAD",
    "date": "2026-06-19T13:30:00+01:00",
    "impact": "Low",
    "forecast": "0.8%",
    "previous": "1.4%",
    "actual": ""
  },
  {
    "title": "Retail Sales m/m",
    "country": "CAD",
    "date": "2026-06-19T13:30:00+01:00",
    "impact": "Low",
    "forecast": "0.6%",
    "previous": "0.9%",
    "actual": ""
  },
  {
    "title": "CB Leading Index m/m",
    "country": "AUD",
    "date": "2026-06-19T15:30:00+01:00",
    "impact": "Low",
    "forecast": "",
    "previous": "-0.6%",
    "actual": ""
  },
  {
    "title": "1-y Loan Prime Rate",
    "country": "CNY",
    "date": "2026-06-22T02:00:00+01:00",
    "impact": "Low",
    "forecast": "",
    "previous": "3.00%",
    "actual": ""
  },
  {
    "title": "5-y Loan Prime Rate",
    "country": "CNY",
    "date": "2026-06-22T02:00:00+01:00",
    "impact": "Low",
    "forecast": "",
    "previous": "3.50%",
    "actual": ""
  },
  {
    "title": "Credit Card Spending y/y",
    "country": "NZD",
    "date": "2026-06-22T04:00:00+01:00",
    "impact": "Low",
    "forecast": "",
    "previous": "2.9%",
    "actual": ""
  },
  {
    "title": "Foreign Direct Investment ytd/y",
    "country": "CNY",
    "date": "2026-06-22T22:00:00+01:00",
    "impact": "Low",
    "forecast": "",
    "previous": "-10.3%",
    "actual": ""
  },
  {
    "title": "CPI m/m",
    "country": "CAD",
    "date": "2026-06-22T13:30:00+01:00",
    "impact": "High",
    "forecast": "",
    "previous": "0.4%",
    "actual": ""
  },
  {
    "title": "Median CPI y/y",
    "country": "CAD",
    "date": "2026-06-22T13:30:00+01:00",
    "impact": "High",
    "forecast": "",
    "previous": "2.1%",
    "actual": ""
  },
  {
    "title": "Trimmed CPI y/y",
    "country": "CAD",
    "date": "2026-06-22T13:30:00+01:00",
    "impact": "High",
    "forecast": "",
    "previous": "2.0%",
    "actual": ""
  },
  {
    "title": "Common CPI y/y",
    "country": "CAD",
    "date": "2026-06-22T13:30:00+01:00",
    "impact": "Medium",
    "forecast": "",
    "previous": "2.5%",
    "actual": ""
  },
  {
    "title": "Core CPI m/m",
    "country": "CAD",
    "date": "2026-06-22T13:30:00+01:00",
    "impact": "Low",
    "forecast": "",
    "previous": "0.2%",
    "actual": ""
  },
  {
    "title": "Consumer Confidence",
    "country": "EUR",
    "date": "2026-06-22T15:00:00+01:00",
    "impact": "Low",
    "forecast": "",
    "previous": "-19",
    "actual": ""
  },
  {
    "title": "Flash Manufacturing PMI",
    "country": "AUD",
    "date": "2026-06-23T00:00:00+01:00",
    "impact": "Low",
    "forecast": "",
    "previous": "50.7",
    "actual": ""
  },
  {
    "title": "Flash Services PMI",
    "country": "AUD",
    "date": "2026-06-23T00:00:00+01:00",
    "impact": "Low",
    "forecast": "",
    "previous": "47.7",
    "actual": ""
  },
  {
    "title": "Flash Manufacturing PMI",
    "country": "JPY",
    "date": "2026-06-23T01:30:00+01:00",
    "impact": "Low",
    "forecast": "",
    "previous": "54.5",
    "actual": ""
  },
  {
    "title": "BOJ Core CPI y/y",
    "country": "JPY",
    "date": "2026-06-23T06:00:00+01:00",
    "impact": "Low",
    "forecast": "",
    "previous": "1.4%",
    "actual": ""
  },
  {
    "title": "French Flash Manufacturing PMI",
    "country": "EUR",
    "date": "2026-06-23T08:15:00+01:00",
    "impact": "Medium",
    "forecast": "",
    "previous": "49.7",
    "actual": ""
  },
  {
    "title": "French Flash Services PMI",
    "country": "EUR",
    "date": "2026-06-23T08:15:00+01:00",
    "impact": "Medium",
    "forecast": "",
    "previous": "42.9",
    "actual": ""
  },
  {
    "title": "German Flash Manufacturing PMI",
    "country": "EUR",
    "date": "2026-06-23T08:30:00+01:00",
    "impact": "Medium",
    "forecast": "",
    "previous": "50.1",
    "actual": ""
  },
  {
    "title": "German Flash Services PMI",
    "country": "EUR",
    "date": "2026-06-23T08:30:00+01:00",
    "impact": "Medium",
    "forecast": "",
    "previous": "47.8",
    "actual": ""
  },
  {
    "title": "Flash Manufacturing PMI",
    "country": "EUR",
    "date": "2026-06-23T09:00:00+01:00",
    "impact": "Low",
    "forecast": "",
    "previous": "51.6",
    "actual": ""
  },
  {
    "title": "Flash Services PMI",
    "country": "EUR",
    "date": "2026-06-23T09:00:00+01:00",
    "impact": "Low",
    "forecast": "",
    "previous": "46.4",
    "actual": ""
  },
  {
    "title": "Flash Manufacturing PMI",
    "country": "GBP",
    "date": "2026-06-23T09:30:00+01:00",
    "impact": "Medium",
    "forecast": "",
    "previous": "53.9",
    "actual": ""
  },
  {
    "title": "Flash Services PMI",
    "country": "GBP",
    "date": "2026-06-23T09:30:00+01:00",
    "impact": "Medium",
    "forecast": "",
    "previous": "47.9",
    "actual": ""
  },
  {
    "title": "CBI Industrial Order Expectations",
    "country": "GBP",
    "date": "2026-06-23T11:00:00+01:00",
    "impact": "Low",
    "forecast": "",
    "previous": "-41",
    "actual": ""
  },
  {
    "title": "ADP Weekly Employment Change",
    "country": "USD",
    "date": "2026-06-23T13:15:00+01:00",
    "impact": "Low",
    "forecast": "",
    "previous": "25.5K",
    "actual": ""
  },
  {
    "title": "Flash Manufacturing PMI",
    "country": "USD",
    "date": "2026-06-23T14:45:00+01:00",
    "impact": "Medium",
    "forecast": "",
    "previous": "55.1",
    "actual": ""
  },
  {
    "title": "Flash Services PMI",
    "country": "USD",
    "date": "2026-06-23T14:45:00+01:00",
    "impact": "Medium",
    "forecast": "",
    "previous": "50.9",
    "actual": ""
  },
  {
    "title": "Richmond Manufacturing Index",
    "country": "USD",
    "date": "2026-06-23T15:00:00+01:00",
    "impact": "Low",
    "forecast": "",
    "previous": "13",
    "actual": ""
  },
  {
    "title": "API Weekly Statistical Bulletin",
    "country": "USD",
    "date": "2026-06-23T21:30:00+01:00",
    "impact": "Low",
    "forecast": "",
    "previous": "",
    "actual": ""
  },
  {
    "title": "BOJ Summary of Opinions",
    "country": "JPY",
    "date": "2026-06-24T00:50:00+01:00",
    "impact": "Low",
    "forecast": "",
    "previous": "",
    "actual": ""
  },
  {
    "title": "SPPI y/y",
    "country": "JPY",
    "date": "2026-06-24T00:50:00+01:00",
    "impact": "Low",
    "forecast": "",
    "previous": "3.0%",
    "actual": ""
  },
  {
    "title": "CPI m/m",
    "country": "AUD",
    "date": "2026-06-24T02:30:00+01:00",
    "impact": "High",
    "forecast": "",
    "previous": "0.4%",
    "actual": ""
  }
];
