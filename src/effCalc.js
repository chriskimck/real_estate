
export function getAvg(data){
    console.log('Calculating efficiency....');

    var res = {}
    res['zipCode'] = data[0]['values']['address']['postal1']


    //console.log(data);
    let curSq = 0;
    let numHouses = 0;
    for(let house of data){
        let sqFt = house['values']['building']['size']['grosssizeadjusted'];
        if(sqFt==0){continue;}
        curSq+=sqFt;
        numHouses+=1;
        //console.log(house['values']['building']['size']['grosssizeadjusted']);
    }

    let avg = curSq/numHouses;

    res['totalSqFt'] = curSq;
    res['numHouse'] = numHouses;
    res['avg'] = avg;


    console.log('Total sqFt: ',curSq);
    console.log('Total houses: ',numHouses);
    console.log('Avergage: ',avg);
    return res;

}









