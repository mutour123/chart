exports.isInArray = (mes, arr) => {
   for (let i = 0; i<arr.length; i++){
       if (mes === arr[i]){
           return true
           break
       }
   }
}