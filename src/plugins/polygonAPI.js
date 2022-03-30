class PolygonAPI {

    #API_KEY = process.env.POLYGON_API_KEY;
    #API_URL = "https://api.polygonscan.com/api?module=account&action=tokennfttx"
    #requestedAddress = "0x0"
    #contractAddress = "0x0" // 0xD795Bb0E45299f8e685B66e903e9c99C271576FF
    #startBlock = 0
    #endBlock = 99999999

    constructor(contractAddress) {
        this.#contractAddress = contractAddress
    }

    async listTokenOf(requestedAddress) {
        this.#requestedAddress = await requestedAddress

        this.#API_URL += "&contractaddress=" + this.#contractAddress
        this.#API_URL += "&address=" + this.#requestedAddress
        this.#API_URL += "&startblock=" + this.#startBlock
        this.#API_URL += "&endblock=" + this.#endBlock
        this.#API_URL += "&page=1&offset=100&sort=asc&apikey=" + this.#API_KEY

        console.log(this.#API_URL)

        // fetch data from API
        let response = await fetch(this.#API_URL)
        let data = await response.json()
        console.log(data)

        // loop through data and return only the tokenIds
        let tokenIds = []

        for (let i = 0; i < data.result.length; i++) {
            tokenIds.push(data.result[i].tokenID)
        }

        return tokenIds
    }
}

export default PolygonAPI