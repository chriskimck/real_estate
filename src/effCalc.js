
export function getAvg(data){
    console.log('Calculating efficiency....');

    var res = {}
    res['zipCode'] = data[0]['values']['address']['postal1']


    //console.log(data);
    let curSq = 0;
    let totalPrice = 0;
    let numHouses = 0;
    for(let house of data){
        let sqFt = house['values']['building']['size']['grosssizeadjusted'];
        if(sqFt==0){continue;}
        curSq+=sqFt;
        numHouses+=1;
        if(typeof house['values']['assessmenthistory'][0] == 'undefined') {
            console.log('lol');
            numHouses-=1;
            continue;
        }
        let price = house['values']['assessmenthistory'][0]['tax']['taxamt'];
        totalPrice+=price;
        //console.log(house['values']['building']['size']['grosssizeadjusted']);
    }

    let avg = curSq/numHouses;
    let price_avg = totalPrice/numHouses/avg;

    res['totalSqFt'] = curSq;
    res['numHouse'] = numHouses;
    res['avg'] = avg;


    console.log('Total sqFt: ',curSq);
    console.log('Total houses: ',numHouses);
    console.log('Average: ',avg);
    console.log('Price: ', price_avg)
    return avg;

}









