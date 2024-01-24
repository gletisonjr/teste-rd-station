function verifyCustomers(customers) {
  if (customers.length > 1000000)
    throw RangeError("invalid customers array length!(over 1.000.000)");
  for (let index = 0; index < customers.length; index += 1) {
    if (customers[index].id > 1000000)
      throw RangeError("invalid customer id number!(over 1.000.000)");
    if (customers[index].score > 100000)
      throw RangeError("invalid customer score number!(over 100.000)");
  }
}

function verifyCustomerSuccess(customerSuccess) {
  if (customerSuccess.length > 1000)
    throw RangeError("invalid customers array length!(over 1.000)");
  for (let index = 0; index < customerSuccess.length; index += 1) {
    if (customerSuccess[index].id > 1000)
      throw RangeError("invalid customerSuccess id number!(over 1.000)");
    if (customerSuccess[index].score > 10000)
      throw RangeError("invalid customerSuccess score number!(over 10.000)");
    for (let index2 = 0; index2 < customerSuccess.length; index2 += 1) {
      if (index == index2) 
        continue;
      if (customerSuccess[index].score == customerSuccess[index2].score)
      throw Error("2 or more customerSuccess with same score number!");
    }
  }
}

function verifyCustomerSucessAbstentions(customerSuccessAway, customerSuccessLength) {
  if (customerSuccessAway.length > Math.floor(customerSuccessLength / 2))
    throw RangeError("invalid customerSuccessAway array length!(over customerSucess.length / 2)");
}

function filterCustomerSucessAbstentions(customerSuccessAway, customerSuccess) {
  return customerSuccess.filter((cs) => {
    for (let index = 0; index < customerSuccessAway.length; index += 1) {
      if ( customerSuccessAway[index] == cs.id)
        return false;
    };
    return true
  });
}

function connectCustomerSucessToCustomers(customers, availableCustomerSuccess) {
  let customersAtendedByCS = [];

  for (let index = 0; index < availableCustomerSuccess.length; index += 1) {
    let customersByCS = [];
    for (let index2 = 0; index2 < customers.length; index2 += 1) {
      if (customersAtendedByCS.some((element) => element.customerId.includes(customers[index2].id)))
        continue;
      if (availableCustomerSuccess[index].score < customers[index2].score)
        break;
      customersByCS.push(customers[index2].id)
    };
    if (customersByCS.length == 0)
      continue;
    customersAtendedByCS.push({
      customerId:  customersByCS,
      customerSuccessId: availableCustomerSuccess[index].id
    });
  };

  return customersAtendedByCS;
}

/**
 * Returns the id of the CustomerSuccess with the most customers
 * @param {array} customerSuccess
 * @param {array} customers
 * @param {array} customerSuccessAway
 */
function customerSuccessBalancing(
  customerSuccess,
  customers,
  customerSuccessAway
) {

  verifyCustomers(customers);
  verifyCustomerSuccess(customerSuccess);
  verifyCustomerSucessAbstentions(customerSuccessAway, customerSuccess.length)

  let availableCustomerSuccess = filterCustomerSucessAbstentions(customerSuccessAway, customerSuccess);

  // ordena os arrays pelo score de forma crescente
  availableCustomerSuccess.sort((a,b) => a.score - b.score);
  customers.sort((a,b) => a.score - b.score);

  let customersAtended = connectCustomerSucessToCustomers(customers, availableCustomerSuccess);
  
  if (customersAtended.length == 0)
    return 0;
  if (customersAtended.length == 1)
    return customersAtended[0].customerSuccessId;
  if (customersAtended.length > 1) // ordena as conexões em forma decrescente
    customersAtended.sort((a,b) => b.customerId.length - a.customerId.length);
  if (customersAtended[0].customerId.length == customersAtended[1].customerId.length)
    return 0;

  return customersAtended[0].customerSuccessId;
}

test("Scenario 1", () => {
  const css = [
    { id: 1, score: 60 },
    { id: 2, score: 20 },
    { id: 3, score: 95 },
    { id: 4, score: 75 },
  ];
  const customers = [
    { id: 1, score: 90 },
    { id: 2, score: 20 },
    { id: 3, score: 70 },
    { id: 4, score: 40 },
    { id: 5, score: 60 },
    { id: 6, score: 10 },
  ];
  const csAway = [2, 4];

  expect(customerSuccessBalancing(css, customers, csAway)).toEqual(1);
});

function buildSizeEntities(size, score) {
  const result = [];
  for (let i = 0; i < size; i += 1) {
    result.push({ id: i + 1, score });
  }
  return result;
}

function mapEntities(arr) {
  return arr.map((item, index) => ({
    id: index + 1,
    score: item,
  }));
}

function arraySeq(count, startAt){
  return Array.apply(0, Array(count)).map((it, index) => index + startAt);
}

test("Scenario 2", () => {
  const css = mapEntities([11, 21, 31, 3, 4, 5]);
  const customers = mapEntities([10, 10, 10, 20, 20, 30, 30, 30, 20, 60]);
  const csAway = [];

  expect(customerSuccessBalancing(css, customers, csAway)).toEqual(0);
});

test("Scenario 3", () => {
  const testTimeoutInMs = 100;
  const testStartTime = new Date().getTime();

  const css = mapEntities(arraySeq(999, 1));
  const customers = buildSizeEntities(10000, 998);
  const csAway = [999];

  expect(customerSuccessBalancing(css, customers, csAway)).toEqual(998);

  if (new Date().getTime() - testStartTime > testTimeoutInMs) {
    throw new Error(`Test took longer than ${testTimeoutInMs}ms!`);
  }
});

test("Scenario 4", () => {
  const css = mapEntities([1, 2, 3, 4, 5, 6]);
  const customers = mapEntities([10, 10, 10, 20, 20, 30, 30, 30, 20, 60]);
  const csAway = [];

  expect(customerSuccessBalancing(css, customers, csAway)).toEqual(0);
});

test("Scenario 5", () => {
  const css = mapEntities([100, 2, 3, 6, 4, 5]);
  const customers = mapEntities([10, 10, 10, 20, 20, 30, 30, 30, 20, 60]);
  const csAway = [];

  expect(customerSuccessBalancing(css, customers, csAway)).toEqual(1);
});

test("Scenario 6", () => {
  const css = mapEntities([100, 99, 88, 3, 4, 5]);
  const customers = mapEntities([10, 10, 10, 20, 20, 30, 30, 30, 20, 60]);
  const csAway = [1, 3, 2];

  expect(customerSuccessBalancing(css, customers, csAway)).toEqual(0);
});

test("Scenario 7", () => {
  const css = mapEntities([100, 99, 88, 3, 4, 5]);
  const customers = mapEntities([10, 10, 10, 20, 20, 30, 30, 30, 20, 60]);
  const csAway = [4, 5, 6];

  expect(customerSuccessBalancing(css, customers, csAway)).toEqual(3);
});

test("Scenario 8", () => {
  const css = mapEntities([60, 40, 95, 75]);
  const customers = mapEntities([90, 70, 20, 40, 60, 10]);
  const csAway = [2, 4];
  expect(customerSuccessBalancing(css, customers, csAway)).toEqual(1);
});
