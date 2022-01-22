// элементы в DOM можно получить при помощи функции querySelector
const fruitsList = document.querySelector(".fruits__list"); // список карточек
const shuffleButton = document.querySelector(".shuffle__btn"); // кнопка перемешивания
const filterButton = document.querySelector(".filter__btn"); // кнопка фильтрации
const sortKindLabel = document.querySelector(".sort__kind"); // поле с названием сортировки
const sortTimeLabel = document.querySelector(".sort__time"); // поле с временем сортировки
const sortChangeButton = document.querySelector(".sort__change__btn"); // кнопка смены сортировки
const sortActionButton = document.querySelector(".sort__action__btn"); // кнопка сортировки
const kindInput = document.querySelector(".kind__input"); // поле с названием вида
const colorInput = document.querySelector(".color__input"); // поле с названием цвета
const weightInput = document.querySelector(".weight__input"); // поле с весом
const addActionButton = document.querySelector(".add__action__btn"); // кнопка добавления

// список фруктов в JSON формате
let fruitsJSON = `[
  {"kind": "Мангустин", "color": "фиолетовый", "weight": 13},
  {"kind": "Дуриан", "color": "зеленый", "weight": 35},
  {"kind": "Личи", "color": "розово-красный", "weight": 17},
  {"kind": "Карамбола", "color": "желтый", "weight": 28},
  {"kind": "Тамаринд", "color": "светло-коричневый", "weight": 22}
]`;

// преобразование JSON в объект JavaScript
let fruits = JSON.parse(fruitsJSON);
console.log(fruits);
/*** ОТОБРАЖЕНИЕ ***/

// определяем цвет элемента
let getColor = (color) => {
  switch (color) {
    case "зеленый":
      return "fruit_green";
    case "фиолетовый":
      return "fruit_violet";
    case "розово-красный":
      return "fruit_carmazin";
    case "светло-коричневый":
      return "fruit_lightbrown";
    case "желтый":
      return "fruit_yellow";
    case "оранжевый":
      return "fruit_orange";
    case "голубой":
      return "fruit_deepskyblue";
    case "синий":
      return "fruit_blue";
  }
};
// отрисовка карточек
const display = () => {
  fruitsList.textContent = "";
  for (let i = 0; i < fruits.length; i++) {
    let li = document.createElement("li");
    let div = document.createElement("div");
    div.innerHTML = `
    <div>index:${[i]}</div>
    <div>kind:${fruits[i].kind} </div>
    <div>color: ${fruits[i].color}</div>
    <div>weight (кг): ${fruits[i].weight}</div>`;
    li.className = `fruit__item ${getColor(fruits[i].color)}`;
    div.className = "fruit__info";
    li.append(div);
    fruitsList.append(li);
  }
};
// первая отрисовка карточек
display();

/*** ПЕРЕМЕШИВАНИЕ ***/

// генерация случайного числа в заданном диапазоне
const getRandomInt = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};
// перемешивание массива
const shuffleFruits = () => {
  fruits.sort();
  let result = [];
  while (fruits.length > 0) {
    result.push(fruits.splice(getRandomInt(0, fruits.length - 1), 1)[0]);
  }
  if (JSON.stringify(fruits) === JSON.stringify(result)) {
    alert("Порядок не изменился.");
  }
  fruits = result;
};
shuffleButton.addEventListener("click", () => {
  shuffleFruits();
  display();
});

/*** ФИЛЬТРАЦИЯ ***/

// фильтрация массива
const filterFruits = () => {
  minWeight = document.querySelector(".minweight__input").value;
  maxWeight = document.querySelector(".maxweight__input").value;
  resultFruits = fruits.filter((item) => {
    return item.weight >= minWeight && item.weight <= maxWeight;
  });
  temp = fruits;
  fruits = resultFruits;
};
filterButton.addEventListener("click", () => {
  filterFruits();
  display();
  fruits = temp;
});

/*** СОРТИРОВКА ***/

let sortKind = "bubbleSort"; // инициализация состояния вида сортировки
let sortTime = "-"; // инициализация состояния времени сортировки
const comparationColor = (a, b) => {
  const rainbow = [
    "розово-красный",
    "оранжевый",
    "желтый",
    "зеленый",
    "голубой",
    "синий",
    "фиолетовый",
    "светло-коричневый",
  ];
  const moreColor = rainbow.indexOf(a.color);
  const lessColor = rainbow.indexOf(b.color);
  return moreColor > lessColor;
};

const sortAPI = {
  bubbleSort(arr, comparation) {
    for (let n = 0; n < arr.length; n++) {
      for (let i = 0; i < arr.length - 1 - n; i++) {
        if (comparation(arr[i], arr[i + 1])) {
          [arr[i], arr[i + 1]] = [arr[i + 1], arr[i]];
        }
      }
    }
  },

  quickSort(arr, comparation) {
    const recursiveSort = (start, end) => {
      if (end - start < 1) {
        return;
      }
      let pivot = arr[end];
      let index = start;
      for (let i = start; i < end; i++) {
        if (!comparation(arr[i], pivot)) {
          if (index !== i) {
            [arr[i], arr[index]] = [arr[index], arr[i]];
          }
          index++;
        }
      }
      arr[end] = arr[index];
      arr[index] = pivot;
      recursiveSort(start, index - 1);
      recursiveSort(index + 1, end);
    };
    recursiveSort(0, arr.length - 1);
  },

  // выполняет сортировку и производит замер времени
  startSort(sort, arr, comparation) {
    const start = new Date().getTime();
    sort(arr, comparation);
    const end = new Date().getTime();
    sortTime = `${end - start} ms`;
  },
};

// инициализация полей
sortKindLabel.textContent = sortKind;
sortTimeLabel.textContent = sortTime;

sortChangeButton.addEventListener("click", () => {
  sortKind === "bubbleSort"
    ? (sortKind = "quickSort")
    : (sortKind = "bubbleSort");
  sortKindLabel.textContent = sortKind;
});

sortActionButton.addEventListener("click", () => {
  const sort = sortAPI[sortKind];
  sortAPI.startSort(sort, fruits, comparationColor);
  display();
  sortTimeLabel.innerHTML = sortTime;
});

/*** ДОБАВИТЬ ФРУКТ ***/

addActionButton.addEventListener("click", () => {
  if (
    kindInput.value === "" ||
    colorInput.value === "" ||
    weightInput.value === ""
  ) {
    alert("Заполните все поля!");
  } else {
    fruits.push({
      kind: kindInput.value,
      color: colorInput.value,
      weight: weightInput.value,
    });
    fruitsJSON = JSON.stringify(fruits);
  }

  display();
});
