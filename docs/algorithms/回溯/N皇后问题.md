# N 皇后问题

[N皇后问题 leetcode 传送门](https://leetcode-cn.com/problems/n-queens/)

## 题目介绍

**n  皇后问题** 研究的是如何将 n  个皇后放置在 n×n 的棋盘上，并且使皇后彼此之间不能相互攻击。

给你一个整数 n ，返回所有不同的  **n  皇后问题** 的解决方案。

每一种解法包含一个不同的  **n 皇后问题** 的棋子放置方案，该方案中 'Q' 和 '.' 分别代表了皇后和空位。

#### 示例1：
![](/images/算法/queens.jpg)
```js
输入：n = 4
输出：[[".Q..","...Q","Q...","..Q."],["..Q.","Q...","...Q",".Q.."]]
解释：如上图所示，4 皇后问题存在两个不同的解法。
```

#### 示例2：
```js
输入：n = 1
输出：[["Q"]]
```

## 思路
因为正确的放置方案必须满足皇后不会相互攻击，所以只要我们找到了判断当前位置的皇后是否安全的办法，我们就可以找到最终答案。

来看下如何判断：

### 横向攻击
横向的攻击可以通过每一层只放置一个皇后来满足，如果当前层级已经放置了一个皇后，则直接跳过当前层级从下一个层级开始继续判断。

### 纵向攻击
纵向攻击需要记录状态，并且比较简单，在放置皇后的时候，将皇后的纵向位置进行记录即可。

### 斜向攻击
在放置皇后时，斜向的攻击也需要进行记录，并且可以找到一定的规律：

+ 假设皇后放在了 `[0, 1]` 的位置：
左斜方 `[1, 0]` 无法放置皇后，右斜方 `[1, 2]`、`[2, 3]` 无法放置皇后。

+ 假设皇后放在了 `[0, 2]` 的位置：
左斜方 `[1, 1]`、`[2, 0]` 无法放置皇后，右斜方 `[1, 3]` 无法放置皇后。

通过上述两个例子可以发现一些规律，我们使用 `i` 表示横向位置，`j` 表示纵向位置，当放置了一个皇后，则皇后目前位置的左斜方向上 `i + j` 无法放置其他皇后，右斜方向上 `i - j` 无法放置皇后。

经过上面三步就完成了判断皇后互相攻击的状态的定义，接下来看应该如何正确的遍历各自。

### 暴力法求解
可以通过两层循环遍历所有 n * n 的格子，并且创建 4 个状态，每次需要根据所有 4 个状态来判断是否可以放置，可以求得最终答案，时间复杂度和空间复杂度均为 O(n^2)。

### 回溯法
由于每一层只需放置一个皇后，放置后就可以进入下一层，所以我们通过深度优先的方式去下一层的四个位置中查找是否存在可能的解，如果存在可以放置的皇后，则记录状态，继续深入下一层位置中查找，如果不存在，则返回上一层，同时复原原本的状态，继续判断同层下一个位置，直到遍历完所有情况。

## 解题：

回溯解法：

```js
var solveNQueens = function(n) {
  const createNArr = (n) =>
    Array.from(new Array(n), () => new Array(n).fill("."));

  let result = [];
  let queen = new Set();
  let diag1 = new Set();
  let diag2 = new Set();

  let recFn = function(depth, arr) {
    if (depth === n) {
      const handleArr = arr.slice();
      result.push(handleArr.map((i) => i.join("").replace(/1/g, ".")));
      return;
    }

    for (let j = 0; j < arr[depth].length; j++) {
      if (!queen.has(j) && !diag1.has(depth + j) && !diag2.has(depth - j)) {
        arr[depth][j] = "Q";
        queen.add(j);
        diag1.add(depth + j);
        diag2.add(depth - j);
        recFn(depth + 1, arr);
        arr[depth][j] = ".";
        queen.delete(j);
        diag1.delete(depth + j);
        diag2.delete(depth - j);
      }
    }
  };

  recFn(0, createNArr(n));
  return result;
};

let result = solveNQueens(4);

result;
```
