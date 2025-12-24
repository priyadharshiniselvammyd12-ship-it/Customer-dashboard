let orders = [];
let editIndex = -1;

let barChart, pieChart, lineChart;
function addOrder() {
  const product = document.getElementById("product").value.trim();
  const quantity = Number(document.getElementById("quantity").value);
  const price = Number(document.getElementById("price").value);

  if (!product || !quantity || !price) {
    alert("Please fill all fields");
    return;
  }

  if (editIndex === -1) {
    orders.push({ product, quantity, price });
  } else {
    orders[editIndex] = { product, quantity, price };
    editIndex = -1;
  }

  clearInputs();
  renderTable();
  renderCharts();
  document.getElementById("chartSection").classList.remove("hidden");
}

function clearInputs() {
  product.value = "";
  quantity.value = "";
  price.value = "";
}

function renderTable() {
  const table = document.getElementById("orderTable");
  table.innerHTML = "";

  orders.forEach((o, index) => {
    table.innerHTML += `
      <tr>
        <td>${o.product}</td>
        <td>${o.quantity}</td>
        <td>${o.price}</td>
        <td>${o.quantity * o.price}</td>
        <td>
          <button class="action-btn edit" onclick="editOrder(${index})">Edit</button>
          <button class="action-btn delete" onclick="deleteOrder(${index})">Delete</button>
        </td>
      </tr>
    `;
  });
}
function editOrder(index) {
  const o = orders[index];
  product.value = o.product;
  quantity.value = o.quantity;
  price.value = o.price;
  editIndex = index;
}


function deleteOrder(index) {
  orders.splice(index, 1);
  renderTable();
  renderCharts();

  if (orders.length === 0) {
    document.getElementById("chartSection").classList.add("hidden");
  }
}


function renderCharts() {
  const labels = orders.map(o => o.product);
  const totals = orders.map(o => o.quantity * o.price);

  if (barChart) barChart.destroy();
  if (pieChart) pieChart.destroy();
  if (lineChart) lineChart.destroy();

  barChart = new Chart(barChartCtx(), {
    type: "bar",
    data: {
      labels,
      datasets: [{
        label: "Sales",
        data: totals,
        backgroundColor: "#38bdf8"
      }]
    }
  });

  pieChart = new Chart(pieChartCtx(), {
    type: "pie",
    data: {
      labels,
      datasets: [{
        data: totals,
        backgroundColor: ["#60a5fa","#34d399","#fbbf24","#f87171"]
      }]
    }
  });

  lineChart = new Chart(lineChartCtx(), {
    type: "line",
    data: {
      labels,
      datasets: [{
        label: "Sales Trend",
        data: totals,
        borderColor: "#6366f1",
        fill: false
      }]
    }
  });
}

function barChartCtx() {
  return document.getElementById("barChart").getContext("2d");
}
function pieChartCtx() {
  return document.getElementById("pieChart").getContext("2d");
}
function lineChartCtx() {
  return document.getElementById("lineChart").getContext("2d");
}
