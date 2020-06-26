
import EMap from '/EnhancedMap.js'

let t5Map = new EMap()
t5Map.set(24294, 'Vial of Potent Blood')
t5Map.set(24341, 'Large Bone')
t5Map.set(24350, 'Large Claw')
t5Map.set(24356, 'Large Fang')
t5Map.set(24288, 'Large Scale')
t5Map.set(24299, 'Intricate Totem')
t5Map.set(24282, 'Potent Venom Sac')
t5Map.set(24276, 'Pile of Incandescent Dust')


let t6Map = new EMap()
t6Map.set(24295, 'Vial of Powerful Blood')
t6Map.set(24358, 'Ancient Bone')
t6Map.set(24351, 'Vicious Claw')
t6Map.set(24357, 'Vicious Fang')
t6Map.set(24289, 'Armored Scale')
t6Map.set(24300, 'Elaborate Totem')
t6Map.set(24283, 'Powerful Venom Sac')
// t6Map.set(24277, 'Pile of Crystalline Dust') -- the convertion recipe for this item is different from the others 

const tierPairingMap = new Map()
tierPairingMap.set(24295,24294)
tierPairingMap.set(24358,24341)
tierPairingMap.set(24351,24350)
tierPairingMap.set(24357,24356)
tierPairingMap.set(24289,24288)
tierPairingMap.set(24300,24299)
tierPairingMap.set(24283,24282)
tierPairingMap.set(24277,24276)


const tierPairingArray = [[24295,24294],[24358,24341],[24351,24350],[24357,24356],[24289,24288],[24300,24299],[24283,24282],[24277,24276]]




// const goldCopperK = 10000

const stoneValue = pricePer140 => (Math.round(((pricePer140*10000)/140)*0.1))


const formatPrice = (price) => {

    let negative = false

    if (price < 0) {
        price = -price
        negative = true
    }


    let sPrice = new String(price)
    let l = sPrice.length
    let output = null
    if (l > 4) {
        output = sPrice.substring(0,l-4) + 'g ' + sPrice.substring(l-4,l-2) + 's ' + sPrice.substring(l-2) + 'c'
    } else if (l > 2) {
        output = sPrice.substring(0,l-2) + 's ' + sPrice.substring(l-2) + 'c'
    } else {
        output = `${sPrice}c`
    }

    return (negative ? `-${output}` : output)
}




/* 
More modular version of previous function
*/
function doProcessResult(dataObjArray, a = 7, b = 0.85) {

    
    // if (obj == null) return 1
    if (dataObjArray == null) return 1

    // format data
    let crystDustObj = dataObjArray[0]
    let t5Obj = dataObjArray[1]
    let t6Obj = dataObjArray[2]

    let crystDustDesc = 'Pile of Incandescent Dust' //t6Map.get(crystDustObj.id)
    let philStoneDesc = 'Philosopher\'s Stone'

    /**
     * prices
     */


    let resultDOM = document.getElementById('breakdown')

    // document.getElementById('ul').remove(); //clear

    /**
     * Generates table header
     */
    let header_labels = [
        'Avg. output',
        'Product',
        'Cost Breakdown (buy price)',
        'Summary',
        'Gold/1 shard'
    ]

    let resultTable = document.createElement('table')
    let cap_tr = document.createElement('tr')

    let th0 = document.createElement('th')
    let header0 = document.createTextNode(header_labels[0])
    th0.appendChild(header0)

    let th1 = document.createElement('th')
    let header1 = document.createTextNode(header_labels[1])
    th1.appendChild(header1)

    let th2 = document.createElement('th')
    th2.setAttribute('colspan',2)
    let header2 = document.createTextNode(header_labels[2])
    th2.appendChild(header2)

    let th3 = document.createElement('th')
    th3.setAttribute('colspan',2)
    let header3 = document.createTextNode(header_labels[3])
    th3.appendChild(header3)

    let th4 = document.createElement('th')
    let header4 = document.createTextNode(header_labels[4])
    th4.appendChild(header4)

    cap_tr.appendChild(th0)
    cap_tr.appendChild(th1)
    cap_tr.appendChild(th2)
    cap_tr.appendChild(th3)
    cap_tr.appendChild(th4)

    resultTable.appendChild(cap_tr)


    for (let t6Entry of t6Obj) {

        
        // find corresponding T5 id
        let expectedT5Id = tierPairingMap.get(t6Entry.id)
        let t5MatchingEntry = null

        for (let t5Entry of t5Obj) {
            if (t5Entry.id == expectedT5Id) {
                t5MatchingEntry = t5Entry
                break
            }
        }
        
        let t6Name = t6Map.get(t6Entry.id)

        // t6 buy/sell
        let t6BuyPrice = t6Entry.buys.unit_price
        let t6SellPrice = t6Entry.sells.unit_price

        let f_t6BuyPrice = formatPrice(t6BuyPrice)
        let f_t6SellPrice = formatPrice(t6SellPrice)

        // t5 name
        let t5Name = t5Map.get(t5MatchingEntry.id)

        // crafting buy price
        let t5UnitBuyPrice = t5MatchingEntry.buys.unit_price
        let t5_x50_buyPrice = t5UnitBuyPrice*50
        let f_t5_x50_buyPrice = formatPrice(t5_x50_buyPrice)

        // crafting sell price
        let t5UnitSellPrice = t5MatchingEntry.sells.unit_price
        let t5_x50_sellPrice = t5UnitSellPrice*50
        let f_t5_x50_sellPrice = formatPrice(t5_x50_sellPrice)

        // crystalline dust prices
        let crystDust_unitBuyPrice = crystDustObj.buys.unit_price
        let crystDust_unitSellPrice = crystDustObj.sells.unit_price
        let crystDust_x5_buyPrice = crystDust_unitBuyPrice*5
        let crystDust_x5_sellPrice = crystDust_unitSellPrice*5
        let f_crystDust_x5_buyPrice = formatPrice(crystDust_x5_buyPrice)
        let f_crystDust_x5_sellPrice = formatPrice(crystDust_x5_sellPrice)
        
        // philosopher's stone price
        let philStoneUnitPrice = 0
        let f_philStoneUnitPrice = formatPrice(philStoneUnitPrice)

        // math breakdown

        let outMatValDesc = '+Output Qty Value'
        let inMatCostDesc = '-Input Material Cost'
        let tpFeeDesc = '-TP Fee'
        let totalDesc = 'Gold / 0.5 Shard'

        // solve for x (shard) where a is the number of t6 ouputed by the MF and b is the post TP fee percentage
        // -- note that 10 philosopher stones cost 1 shard, so the 5 stones used in the recipe are worth 0.5 shards --
        // t6 + 50*t5 + 5*dust + 5*0.1*x = a*t6*b
        // t6 + 50*t5 + 5*dust - a*t6*b = -5*0.1*x
        // a*t6*b - t6 - 50*t5 - 5*dust = 5*0.1*x
        // x = (a*t6*b - t6 - 50*t5 - 5*dust)/5*0.1

        // a = 7
        // b = 0.85

        let inputMatCost = -(t6BuyPrice + t5_x50_buyPrice + crystDust_x5_buyPrice)
        let outputMatValue = a*t6SellPrice
        let outputPostFeeValue = Math.round(outputMatValue*b)
        let tpFee = -(outputMatValue - outputPostFeeValue)
        let halfShardValue = outputPostFeeValue + inputMatCost
        let fullShardValue = halfShardValue*2
        let f_inputMatCost = formatPrice(inputMatCost)
        let f_outputMatValue = formatPrice(outputMatValue)
        let f_outputPostFeeValue = formatPrice(outputPostFeeValue)
        let f_tpFee = formatPrice(tpFee)
        let f_halfShardValue = formatPrice(halfShardValue)
        let f_fullShardValue = formatPrice(fullShardValue)

        
        // do created results

        let body_tr = document.createElement('tr')


        let td_avg_out = document.createElement('td')
        td_avg_out.setAttribute('class', 'hl')

        let avg_out_txt = document.createTextNode(a)
        let avg_out_span = document.createElement('span')
        avg_out_span.setAttribute('class', 'big')
        avg_out_span.appendChild(avg_out_txt)
        td_avg_out.appendChild(avg_out_span)

        let avg_out_br = document.createElement('br')
        td_avg_out.appendChild(avg_out_br)
        
        let t6_val_txt = document.createTextNode(f_outputMatValue)
        let t6_val_span = document.createElement('span')
        t6_val_span.appendChild(t6_val_txt)
        td_avg_out.appendChild(t6_val_span)


        let td_product = document.createElement('td')
        let product_txt = document.createTextNode(t6Name)
        td_product.appendChild(product_txt)


        let td_mat_list = document.createElement('td')
        td_mat_list.setAttribute('class', 'material')
        let mat_list_txt1 = document.createTextNode(`1x  ${t6Name}`)
        let mat_list_span1 = document.createElement('span')
        let mat_list_br1 = document.createElement('br')
        mat_list_span1.appendChild(mat_list_txt1)
        let mat_list_txt2 = document.createTextNode(`50x ${t5Name}`)
        let mat_list_span2 = document.createElement('span')
        let mat_list_br2 = document.createElement('br')
        mat_list_span2.appendChild(mat_list_txt2)
        let mat_list_txt3 = document.createTextNode(`5x  ${crystDustDesc}`)
        let mat_list_span3 = document.createElement('span')
        let mat_list_br3 = document.createElement('br')
        mat_list_span3.appendChild(mat_list_txt3)
        let mat_list_txt4 = document.createTextNode(`5x  ${philStoneDesc}`)
        let mat_list_span4 = document.createElement('span')
        mat_list_span4.appendChild(mat_list_txt4)

        td_mat_list.appendChild(mat_list_span1)
        td_mat_list.appendChild(mat_list_br1)
        td_mat_list.appendChild(mat_list_span2)
        td_mat_list.appendChild(mat_list_br2)
        td_mat_list.appendChild(mat_list_span3)
        td_mat_list.appendChild(mat_list_br3)
        td_mat_list.appendChild(mat_list_span4)


        let td_mat_cost = document.createElement('td')
        td_mat_cost.setAttribute('class', 'cost rt')
        let mat_cost_txt1 = document.createTextNode(f_t6BuyPrice)
        let mat_cost_span1 = document.createElement('span')
        let mat_cost_br1 = document.createElement('br')
        mat_cost_span1.appendChild(mat_cost_txt1)
        let mat_cost_txt2 = document.createTextNode(f_t5_x50_buyPrice)
        let mat_cost_span2 = document.createElement('span')
        let mat_cost_br2 = document.createElement('br')
        mat_cost_span2.appendChild(mat_cost_txt2)
        let mat_cost_txt3 = document.createTextNode(f_crystDust_x5_buyPrice)
        let mat_cost_span3 = document.createElement('span')
        let mat_cost_br3 = document.createElement('br')
        mat_cost_span3.appendChild(mat_cost_txt3)
        let mat_cost_txt4 = document.createTextNode(philStoneUnitPrice)
        let mat_cost_span4 = document.createElement('span')
        let mat_cost_br4 = document.createElement('br')
        mat_cost_span4.appendChild(mat_cost_txt4)
        let mat_cost_total_txt = document.createTextNode(f_inputMatCost)
        let mat_cost_total_span = document.createElement('span')
        mat_cost_total_span.setAttribute('class', 'sum')
        mat_cost_total_span.appendChild(mat_cost_total_txt)

        td_mat_cost.appendChild(mat_cost_span1)
        td_mat_cost.appendChild(mat_cost_br1)
        td_mat_cost.appendChild(mat_cost_span2)
        td_mat_cost.appendChild(mat_cost_br2)
        td_mat_cost.appendChild(mat_cost_span3)
        td_mat_cost.appendChild(mat_cost_br3)
        td_mat_cost.appendChild(mat_cost_span4)
        td_mat_cost.appendChild(mat_cost_br4)
        td_mat_cost.appendChild(mat_cost_total_span)


        let td_math_desc = document.createElement('td')
        td_math_desc.setAttribute('class', 'math')
        let math_desc_txt1 = document.createTextNode(outMatValDesc)
        let math_desc_span1 = document.createElement('span')
        let math_desc_br1 = document.createElement('br')
        math_desc_span1.appendChild(math_desc_txt1)
        let math_desc_txt2 = document.createTextNode(inMatCostDesc)
        let math_desc_span2 = document.createElement('span')
        let math_desc_br2 = document.createElement('br')
        math_desc_span2.appendChild(math_desc_txt2)
        let math_desc_txt3 = document.createTextNode(tpFeeDesc)
        let math_desc_span3 = document.createElement('span')
        let math_desc_br3 = document.createElement('br')
        math_desc_span3.appendChild(math_desc_txt3)
        let math_desc_total_txt = document.createTextNode(totalDesc)
        let math_desc_total_span = document.createElement('span')
        math_desc_total_span.setAttribute('class', 'sum')
        math_desc_total_span.appendChild(math_desc_total_txt)

        td_math_desc.appendChild(math_desc_span1)
        td_math_desc.appendChild(math_desc_br1)
        td_math_desc.appendChild(math_desc_span2)
        td_math_desc.appendChild(math_desc_br2)
        td_math_desc.appendChild(math_desc_span3)
        td_math_desc.appendChild(math_desc_br3)
        td_math_desc.appendChild(math_desc_total_span)


        let td_math_calc = document.createElement('td')
        td_math_calc.setAttribute('class', 'math rt')
        let math_calc_txt1 = document.createTextNode(f_outputMatValue)
        let math_calc_span1 = document.createElement('span')
        let math_calc_br1 = document.createElement('br')
        math_calc_span1.appendChild(math_calc_txt1)
        let math_calc_txt2 = document.createTextNode(f_inputMatCost)
        let math_calc_span2 = document.createElement('span')
        let math_calc_br2 = document.createElement('br')
        math_calc_span2.appendChild(math_calc_txt2)
        let math_calc_txt3 = document.createTextNode(f_tpFee)
        let math_calc_span3 = document.createElement('span')
        let math_calc_br3 = document.createElement('br')
        math_calc_span3.appendChild(math_calc_txt3)
        let math_calc_part_txt = document.createTextNode(f_halfShardValue)
        let math_calc_part_span = document.createElement('span')
        math_calc_part_span.setAttribute('class', 'sum')
        math_calc_part_span.appendChild(math_calc_part_txt)

        td_math_calc.appendChild(math_calc_span1)
        td_math_calc.appendChild(math_calc_br1)
        td_math_calc.appendChild(math_calc_span2)
        td_math_calc.appendChild(math_calc_br2)
        td_math_calc.appendChild(math_calc_span3)
        td_math_calc.appendChild(math_calc_br3)
        td_math_calc.appendChild(math_calc_part_span)


        let td_shard_value = document.createElement('td')
        td_shard_value.setAttribute('class', 'hl')
        let shard_value_txt = document.createTextNode(f_fullShardValue)
        let shard_value_span = document.createElement('span')
        shard_value_span.setAttribute('class', 'big')
        shard_value_span.appendChild(shard_value_txt)
        td_shard_value.appendChild(shard_value_span)


        body_tr.appendChild(td_avg_out)
        body_tr.appendChild(td_product)
        body_tr.appendChild(td_mat_list)
        body_tr.appendChild(td_mat_cost)
        body_tr.appendChild(td_math_desc)
        body_tr.appendChild(td_math_calc)
        body_tr.appendChild(td_shard_value)


        resultTable.appendChild(body_tr)
    }
    
    resultDOM.appendChild(resultTable)
}





// TODO - this function will have to be reworked so the app has a clear separation between view and control
function renderResultList(dataObjArray) {

    
    // if (obj == null) return 1
    if (dataObjArray == null) return 1

    // format data
    let crystDustObj = dataObjArray[0]
    let t5Obj = dataObjArray[1]
    let t6Obj = dataObjArray[2]


    let resultDOM = document.getElementById('breakdown')

    // document.getElementById('ul').remove(); //clear

    let list = document.createElement('ul')

    for (let t6Entry of t6Obj) {

        // find corresponding T5 id
        let expectedT5Id = tierPairingMap.get(t6Entry.id)
        let t5MatchingEntry = null

        for (let t5Entry of t5Obj) {
            if (t5Entry.id == expectedT5Id) {
                t5MatchingEntry = t5Entry
                break
            }
        }
        
        let t6Name = t6Map.get(t6Entry.id)

        // t6 buy/sell
        let t6BuyPrice = formatPrice(t6Entry.buys.unit_price)
        let t6SellPrice = formatPrice(t6Entry.sells.unit_price)

        // t5 name
        let t5Name = t5Map.get(t5MatchingEntry.id);

        // crafting buy price
        let t5_x50_buy = formatPrice(t5MatchingEntry.buys.unit_price*50)

        // crafting sell price
        let t5_x50_sell = formatPrice(t5MatchingEntry.sells.unit_price*50)

        // crystalline dust prices
        let crystDust_x5_BuyPrice = formatPrice(crystDustObj.buys.unit_price*5)
        let crystDust_x5_SellPrice = formatPrice(crystDustObj.sells.unit_price*5)

        // do created results

        let li = document.createElement('li')

        let t6NameLabel = document.createTextNode('Name: ' + t6Name)
        let br1 = document.createElement('br')
        li.appendChild(t6NameLabel)
        li.appendChild(br1)


        let t6PricesLabel = document.createTextNode(t6Name + ' price (Buy/Sell): ' + t6BuyPrice + '/' + t6SellPrice)
        let br2 = document.createElement('br')
        li.appendChild(t6PricesLabel)
        li.appendChild(br2)

        let t5PricesLabel = document.createTextNode(t5Name + ' x50 price (Buy/Sell): ' + t5_x50_buy + '/' + t5_x50_sell)
        let br3 = document.createElement('br')
        li.appendChild(t5PricesLabel)
        li.appendChild(br3)


        let crystDustPrice_x5_label = document.createTextNode(t6Map.get(crystDustObj.id) + ' x5 price (Buy/Sell): ' + crystDust_x5_BuyPrice + '/' + crystDust_x5_SellPrice)
        let br4 = document.createElement('br')
        li.appendChild(crystDustPrice_x5_label)
        li.appendChild(br4)

        let stoneLabel = document.createTextNode('Philosopher\'s Stone value: NA')
        let br5 = document.createElement('br')
        li.appendChild(stoneLabel)
        li.appendChild(br5)

        // solve for x (shard) where a is the number of t6 ouputed by the MF and b is the post TP fee percentage
        // -- note that 10 philosopher stones cost 1 shard, so the 5 stones used in the recipe are worth 0.5 shards --
        // t6 + 50*t5 + 5*dust + 5*0.1*x = a*t6*b
        // t6 + 50*t5 + 5*dust - a*t6*b = -5*0.1*x
        // a*t6*b - t6 - 50*t5 - 5*dust = 5*0.1*x
        // x = (a*t6*b - t6 - 50*t5 - 5*dust)/5*0.1

        let a = 7
        let b = 0.85

        let cost_buy = t6Entry.buys.unit_price + 50*t5MatchingEntry.buys.unit_price + 5*crystDustObj.buys.unit_price
        let cost_sell = t6Entry.sells.unit_price - 50*t5MatchingEntry.sells.unit_price - 5*crystDustObj.sells.unit_price
        let x_buy = (a*t6Entry.sells.unit_price*b - t6Entry.buys.unit_price - 50*t5MatchingEntry.buys.unit_price - 5*crystDustObj.buys.unit_price)/0.5 
        let x_sell = (a*t6Entry.sells.unit_price*b - t6Entry.sells.unit_price - 50*t5MatchingEntry.sells.unit_price - 5*crystDustObj.sells.unit_price)/0.5

        let shardValueLabel = document.createTextNode('Shard Value (Buy/Sell): ' + formatPrice(Math.round(x_buy)) + '/' + formatPrice(Math.round(x_sell)))
        let br6 = document.createElement('br')

        li.appendChild(shardValueLabel)
        li.appendChild(br6)
        li.appendChild(document.createTextNode(formatPrice(Math.round(cost_buy))))

        list.appendChild(li)
    }
    
    resultDOM.appendChild(list)
}



const gw2Api = 'https://api.guildwars2.com'
const tpPrices = '/v2/commerce/prices'

const t5List = t5Map.toString()
const t6List = t6Map.toString()

// console.log(`Fetching: ${gw2Api + tpPrices}?ids=${t5List}`)

// new fetch format



const apiHandler = () => {

    const crystDustId = 24277
    const promDustPrice = fetch(`${gw2Api + tpPrices}/${crystDustId}`)
    const promT5 = fetch(`${gw2Api + tpPrices}?ids=${t5List}`)
    const promT6 = fetch(`${gw2Api + tpPrices}?ids=${t6List}`)

    Promise.all([promDustPrice, promT5, promT6])
        .then(res => Promise.all([res[0].json(), res[1].json(), res[2].json()]))
        .then(data => doProcessResult(data))

}

apiHandler()




