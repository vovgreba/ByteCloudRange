const rangeStorange = document.getElementById('range-storange')
const rangeTransfer = document.getElementById('range-transfer')

const amountStorange = document.querySelector('.amount-storange');
const amountTransfer = document.querySelector('.amount-transfer');

const diagramBackblaze = document.querySelector('.diagram-backblaze');
const diagramVultr = document.querySelector('.diagram-vultr');
const diagramBunny = document.querySelector('.diagram-bunny');
const diagramScaleway = document.querySelector('.diagram-scaleway');

const priceBackblaze = document.querySelector('.price-backblaze');
const priceVultr = document.querySelector('.price-vultr');
const priceBunny = document.querySelector('.price-bunny');
const priceScaleway = document.querySelector('.price-scaleway');


const params = document.querySelectorAll('.param');


for(let paramsValue of params) {
  
  paramsValue.addEventListener('click', ev=> {
    paramsValue.classList.add('active')
    const elementsSibling = paramsValue.nextElementSibling
    elementsSibling ? elementsSibling.classList.remove('active')
    : paramsValue.previousElementSibling .classList.remove('active')
  })
}



amountStorange.innerText = `${rangeStorange.value}GB`
amountTransfer.innerText = `${rangeTransfer.value}GB`

const providerPrices = {
  backblaze: {
    minPayment: 7,
    storagePrice: 0.005,
    transferPrice: 0.01,
    color: 'red'
  },
  bunny:{
    maxPayment: 10,
    hddPrice: 0.01,
    ssdPrice: 0.02,
    transferPrice: 0.01,
    color: 'orange'
  },
  scaleway:{
    multiPrice: 0.06,
    singlePrice: 0.03,
    transferPrice: 0.02,
    color: 'violet',
  },
  vultr:{
    minPayment: 5,
    storagePrice: 0.01,
    transferPrice: 0.01,
    color: 'blue'
  },

}
const getPriceProvidersBunny = (element, providerName, storageGB, transferGB)=> {
  const innetText = element.innerText.toLowerCase() + 'Price';

  const {maxPayment, hddPrice, ssdPrice, transferPrice } = providerPrices[providerName];

  const storageCost = innetText === 'hddPrice' ? hddPrice * storageGB : ssdPrice * storageGB;
  const transferCost = transferPrice * transferGB;
  const totalCost = storageCost + transferCost > maxPayment ? 10 : storageCost + transferCost

  return totalCost
}

const getPriceProvidersScaleway = (element, providerName, storageGB, transferGB)=> {
  const innetText = element.innerText.toLowerCase() + 'Price';

  const { multiPrice, singlePrice, transferPrice } = providerPrices[providerName];

  let storageCost = 0

  if(storageGB > 75) {
    storageCost = innetText === 'multiPrice' ? multiPrice * (storageGB - 75 ): singlePrice * (storageGB - 75 );
  }else {
    storageCost = 0
  }

  const transferCost = transferGB > 75 ? transferPrice * (storageGB - 75 ) : 0
  const totalCost = storageCost + transferCost

  return totalCost
}

const findParameterActive = (providerName, storageGB, transferGB)=> {

  let parentElement = null;
  providerName === 'bunny' ? parentElement = document.querySelector('.params-bunny')
  :parentElement = document.querySelector('.params-scaleway')

  for(let element of parentElement.children) {
    let elementActive = element.classList.contains('active')
    if(elementActive && providerName === 'bunny') {
      return getPriceProvidersBunny(element, providerName, storageGB, transferGB)
    }
    if(elementActive && providerName === 'scaleway') {
      return getPriceProvidersScaleway(element, providerName, storageGB, transferGB)
    }
  }
}
const getPriceProviders = (providerName, storageGB, transferGB) => {
  if(providerName === 'bunny' || providerName === 'scaleway' ) {
    return findParameterActive(providerName, storageGB, transferGB)
  }
  const {minPayment, storagePrice, transferPrice } = providerPrices[providerName];

  const storageCost = storagePrice * storageGB;
  const transferCost = transferPrice * transferGB;
  const totalCost = Math.max(minPayment, storageCost + transferCost);

  return totalCost;
}


const getProviders = (providerName, storageGB, transferGB) => {
  const providerPrice = {}

  for(let value in providerName) {
    providerPrice[value] =  getPriceProviders(value, storageGB, transferGB ).toFixed(2)
  }
  return providerPrice;
}


const writesDate = (name, priceName, diagramName)=> {
  const screenWidth = window.screen.width
  priceName.innerText =  +name ? `${ name }$` : `free`
  let calculationBunny = Math.floor(name) * 5
  screenWidth < 700 ? diagramName.style.height = `${ calculationBunny }px`
  : diagramName.style.width = `${ calculationBunny }px`
  
}

const drawDiagram =(obj, comparison) => {
  
  for(let value in obj) {
  
    if(obj[value] === comparison) {
      const { color } = providerPrices[value]
      if(value === 'backblaze') {
        diagramBackblaze.style.backgroundColor = color
        diagramVultr.style.backgroundColor = '#bbbfc2'
        diagramBunny.style.backgroundColor = '#bbbfc2'
        diagramScaleway.style.backgroundColor = '#bbbfc2'
        diagramScaleway.style.borderColor = '#bbbfc2'
      }
      if(value === 'vultr') {
        diagramVultr.style.backgroundColor = color
        diagramBunny.style.backgroundColor = '#bbbfc2'
        diagramBackblaze.style.backgroundColor = '#bbbfc2'
        diagramScaleway.style.backgroundColor = '#bbbfc2'
        diagramScaleway.style.borderColor = '#bbbfc2'
      }
      if(value === 'bunny') {
        diagramBunny.style.backgroundColor = color
        diagramVultr.style.backgroundColor = '#bbbfc2'
        diagramBackblaze.style.backgroundColor = '#bbbfc2'
        diagramScaleway.style.backgroundColor = '#bbbfc2'
        diagramScaleway.style.borderColor = '#bbbfc2'
      }
      if(value === 'scaleway') {
        console.log('ff')
        diagramScaleway.style.backgroundColor = color
        diagramScaleway.style.borderColor = color
        diagramBunny.style.backgroundColor = '#bbbfc2'
        diagramVultr.style.backgroundColor = '#bbbfc2'
        diagramBackblaze.style.backgroundColor = '#bbbfc2'
      }
    }
    
  }
}

rangeStorange.addEventListener('input', ev=> {
  const quantityStorage = ev.target.value
  amountStorange.innerText = `${quantityStorage}GB`
  
  const {backblaze, vultr, bunny, scaleway } = getProviders(providerPrices, quantityStorage, rangeTransfer.value )
  
  writesDate(backblaze, priceBackblaze, diagramBackblaze )
  writesDate(vultr, priceVultr, diagramVultr )
  writesDate(bunny, priceBunny, diagramBunny )
  writesDate(scaleway, priceScaleway, diagramScaleway )

  const objPrividers = {
    backblaze:  +backblaze,
    vultr:  +vultr,
    bunny:  +bunny,
    scaleway: +scaleway,

  }
  const comparison = Math.min(+backblaze, +vultr, +bunny, +scaleway);
  drawDiagram(objPrividers, comparison)

})

rangeTransfer.addEventListener('input', ev=> {
  const quantityTransfer = ev.target.value
  amountTransfer.innerText = `${quantityTransfer}GB`
  
  const {backblaze, vultr, bunny, scaleway } = getProviders(providerPrices, rangeStorange.value, quantityTransfer)

  writesDate(backblaze, priceBackblaze, diagramBackblaze )
  writesDate(vultr, priceVultr, diagramVultr )
  writesDate(bunny, priceBunny, diagramBunny )
  writesDate(scaleway, priceScaleway, diagramScaleway )

  const objPrividers = {
    backblaze:  +backblaze,
    vultr:  +vultr,
    bunny:  +bunny,
    scaleway:  +scaleway,
  }

  const comparison = Math.min(+backblaze, +vultr, +bunny, +scaleway)
  drawDiagram(objPrividers, comparison)

})


