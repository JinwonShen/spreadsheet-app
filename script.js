const spreadSheetContainer = document.querySelector("#spreadsheet-container");
const exportBtn = document.querySelector("#export-btn");
const ROWS = 10;
const COLS = 10;
const spreadsheet = [];
const alphabets = [
  "A",
  "B",
  "C",
  "D",
  "E",
  "F",
  "G",
  "H",
  "I",
  "J",
  "K",
  "L",
  "M",
  "N",
  "O",
  "P",
  "Q",
  "R",
  "S",
  "T",
  "U",
  "V",
  "W",
  "X",
  "Y",
  "Z",
];

// cell 데이터
class Cell {
  constructor(
    isHeader,
    disabled,
    data,
    row,
    rowName,
    column,
    columnName,
    active = false
  ) {
    this.isHeader = isHeader;
    this.disabled = disabled;
    this.data = data;
    this.row = row;
    this.rowName = rowName;
    this.column = column;
    this.columnName = columnName;
    this.active = active;
  }
}

exportBtn.onclick = function (e) {
  let csv = "";
  for (let i = 0; i < spreadsheet.length; i++) {
    if (i === 0) continue;
    csv +=
      spreadsheet[i]
        .filter((item) => !item.isHeader)
        .map((item) => item.data)
        .join(",") + "\r\n";
  }
  console.log("csv: ", csv);

  const csvObj = new Blob([csv]);
  const csvUrl = URL.createObjectURL(csvObj);
  console.log("csvUrl", csvUrl);

  const a = document.createElement("a");
  a.href = csvUrl;
  a.download = "spreadsheet name.csv";
  a.click();
};

// cell 배열데이터
function initSpreadsheet() {
  for (let i = 0; i < ROWS; i++) {
    let spreadsheetRow = [];
    for (let j = 0; j < COLS; j++) {
      let cellData = "";
      let isHeader = false;
      let disabled = false;

      // 모든 row 첫 번째 column에 숫자 넣기
      if (j === 0) {
        cellData = i;
        isHeader = true;
        disabled = true;
      }

      // 첫 번째 row의 column은 "" 비운다.
      if (i === 0) {
        cellData = alphabets[j - 1];
        isHeader = true;
        disabled = true;
      }

      // cellData가 undefined이면 "" 비운다.
      if (!cellData) {
        cellData = "";
      }

      const rowName = i;
      const columnName = alphabets[j - 1];

      const cell = new Cell(
        isHeader,
        disabled,
        cellData,
        i,
        rowName,
        j,
        columnName,
        false
      );

      spreadsheetRow.push(cell); // 0-0 0-1 0-2 0-3 ...
    }
    spreadsheet.push(spreadsheetRow);
  }
  drawSheet();
  // console.log(spreadsheet);
}

initSpreadsheet();

// cell 요소 생성
function createCellEl(cell) {
  const cellEl = document.createElement("input");
  cellEl.className = "cell";
  cellEl.id = "cell_" + cell.row + cell.column;
  cellEl.value = cell.data;
  cellEl.disabled = cell.disabled;

  // header 영역에 클래스 추가
  if (cell.isHeader) {
    cellEl.classList.add("header");
  }

  cellEl.onclick = () => {
    handleCellClick(cell);
  };

  cellEl.onchange = (e) => {
    handleOnChange(e.target.value, cell);
  };

  return cellEl;
}

function handleOnChange(data, cell) {
  cell.data = data;
}

// 클릭한 cell 객체 데이터 가져오기
function handleCellClick(cell) {
  clearHeaderActiveStates();
  const columnHeader = spreadsheet[0][cell.column];
  const rowHeader = spreadsheet[cell.row][0];
  const columnHeaderEl = getElementFromRowCol(
    columnHeader.row,
    columnHeader.column
  );
  const rowHeaderEl = getElementFromRowCol(rowHeader.row, rowHeader.column);

  columnHeaderEl.classList.add("active");
  rowHeaderEl.classList.add("active");
  // 클릭한 cell 출력
  document.querySelector("#cell-status").innerHTML =
    cell.columnName + cell.rowName;
}

function clearHeaderActiveStates() {
  const headers = document.querySelectorAll(".header");

  headers.forEach((header) => {
    header.classList.remove("active");
  });
}

function getElementFromRowCol(row, col) {
  return document.querySelector(`#cell_` + row + col);
}

// cell 그리기
function drawSheet() {
  for (let i = 0; i < spreadsheet.length; i++) {
    const rowContainerEl = document.createElement("div");
    rowContainerEl.className = "cell-row";

    for (let j = 0; j < spreadsheet[i].length; j++) {
      const cell = spreadsheet[i][j];
      rowContainerEl.append(createCellEl(cell));
    }
    spreadSheetContainer.append(rowContainerEl);
  }
}
