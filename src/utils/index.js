export function createNewTemplateFrom(base){
    const newTemplate = {...base};
    const rates = base.rates.map(rate => [...rate]);

    newTemplate.rates = rates;

    return newTemplate;
}


