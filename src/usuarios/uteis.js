function gerarProximoId(data) {
    if (data.length === 0) return 1;
    let max = data[0].id;
    for (let i in data){
        max = Math.max(max,data[i].id);
    }

    return max;
}

const data = []

for (let i = 0; i < 1000; i++){
    data.push({nome: "nome"+i,
        id: i
    });
}

console.log(gerarProximoId(data));