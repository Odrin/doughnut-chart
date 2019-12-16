import { DoughnutChart } from "../src";

const rnd = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;
const colors = [
  'rgb(54, 162, 235)',
  'rgb(75, 192, 192)',
  'rgb(255, 159, 64)',
  'rgb(153, 102, 255)',
  'rgb(255, 99, 132)',
  'rgb(255, 205, 86)'
];

let data = colors.map((color) => ({ value: 1, color }));

const random = document.createElement('button');
const add = document.createElement('button');
const remove = document.createElement('button');
const canvas = document.createElement('canvas');

canvas.width = 300;
canvas.height = 300;
canvas.style.margin = '100px';

random.innerText = 'Random';
random.style.marginLeft = '10px';
random.onclick = () => {
  data.forEach((item, i) => {
    let color = colors[rnd(0, colors.length - 1)];

    while (i > 0 && (color === data[i - 1].color || (i === data.length - 1 && color === data[0].color))) {
      color = colors[rnd(0, colors.length - 1)];
    }

    item.value = rnd(1, 10);
    item.color = color;
  });

  chart.data(data);
};

add.innerText = 'Add';
add.style.marginLeft = '10px';
add.onclick = () => {
  let color = colors[rnd(0, colors.length - 1)];

  while (data.length > 0 && (color === data[0].color || color === data[data.length - 1].color)) {
    color = colors[rnd(0, colors.length - 1)];
  }

  data.push({
    value: rnd(1, 10),
    color: color,
  });
  chart.data(data);
};

remove.innerText = 'Remove';
remove.style.marginLeft = '10px';
remove.onclick = () => {
  data.pop();
  chart.data(data);
};

document.body.appendChild(canvas);
document.body.appendChild(random);
document.body.appendChild(add);
document.body.appendChild(remove);

const chart = new DoughnutChart(canvas, {
  cutoutPercentage: 50,
  animationDuration: 600,
  animationEasing: 'easeOutQuart',
});

chart.data(data);

console.log(chart);
