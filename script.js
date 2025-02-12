document.addEventListener("DOMContentLoaded", ()=>{
  const expenseForm = document.getElementById("expense-form");
  const expenseName = document.getElementById("expense-name");
  const expenseAmount = document.getElementById("expense-amount");
  const expenseList = document.getElementById("expense-list");
  const totalExpense = document.getElementById("total-amount");
  const expenseChartCanvas = document.getElementById("expense-chart")

  let expenses= JSON.parse(localStorage.getItem('expenses')) || []
  let totalAmount = calculateTotal();
  let expenseChart;

  renderExpenses();
  updateTotal();
  updateChart();

  expenseForm.addEventListener("submit", e=>{
    e.preventDefault();
    const name = expenseName.value.trim();
    const amount = parseFloat(expenseAmount.value.trim());

    if(name !== "" && !isNaN(amount) && amount>0){
      const newExp = {
        id : Date.now(),
        name,
        amount,
      }
      expenses.push(newExp);
      saveExpensesToLocal();
      renderExpenses();
      updateTotal();
      updateChart();

      expenseName.value=""
      expenseAmount.value=""
    }
  })

  function renderExpenses(){
    expenseList.innerHTML='';
    expenses.forEach(expense =>{
      const li = document.createElement("li");
      li.innerHTML=`
      ${expense.name} - Rs.${expense.amount}
      <button class="edit-btn" data-id=${expense.id}>Edit</button>
      <button class="delete-btn" data-id=${expense.id}>Delete</button>`
      expenseList.appendChild(li);
    })

    document.querySelectorAll(".delete-btn").forEach((btn)=>
      btn.addEventListener("click", deleteExpense)
    )
    document.querySelectorAll(".edit-btn").forEach((btn)=>
      btn.addEventListener("click", editExpense)
    )
  }

  function updateTotal(){
    totalAmount = calculateTotal();
    totalExpense.textContent = totalAmount.toFixed(2);
  }

  function calculateTotal(){
    return expenses.reduce((sum, expense) => sum + expense.amount, 0)
  }

  function saveExpensesToLocal(){
    localStorage.setItem('expenses', JSON.stringify(expenses));
  }

  function deleteExpense(e){
    const id = parseInt(e.target.dataset.id);
    expenses = expenses.filter((expense)=>expense.id !== id);
    saveExpensesToLocal();
    renderExpenses();
    updateTotal();
    updateChart();
  }

  function editExpense(e) {
    const id = parseInt(e.target.dataset.id);
    const expense = expenses.find((exp) => exp.id === id);

    if (expense) {
      expenseName.value = expense.name;
      expenseAmount.value = expense.amount;

      expenses = expenses.filter((exp) => exp.id !== id);
      saveExpensesToLocal();
      renderExpenses();
      updateTotal();
      updateChart();
    }
  }

function updateChart(){
  const expenseMap = {};
  expenses.forEach((expense)=>{
    if(expenseMap[expense.name]){
      expenseMap[expense.name] += expense.amount
    }else {
      expenseMap[expense.name] = expense.amount;
    }
  })
    const labels = Object.keys(expenseMap);
    const data = Object.values(expenseMap);

    if(expenseChart){
    expenseChart.destroy();
    }

    expenseChart = new Chart(expenseChartCanvas,{
      type: "pie",
      data :{
        labels: labels,
        datasets:[
          {
            data:data,
            backgroundColor: ["#FF6384","#36A2EB","#FFCE56","#4BC0C0","#9966FF","#FF9F40",]
          },
        ],
      },
      options: {
        responsive: true,
        plugins: {
          legend:{
            position: "top",
          },
        },
      },
    });
  }
});