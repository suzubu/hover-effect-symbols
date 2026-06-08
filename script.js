const config = {
  symbols: ["0", "X", "*", ">", "$", "W", "%"],
  blockSize: 25,
  detectionRadius: 50,
  clusterSize: 7,
  blockLifetime: 300,
  emptyRatio: 0.3,
  scrambleRatio: 0.25,
  scrambleInterval: 150,
};

function getRandomSymbol() {
  return config.symbols[Math.floor(Math.random() * config.symbols.length)];
}

function initGridOverlay(element) {
  const gridOverlay = document.createElement("div");
  gridOverlay.className = "grid-overlay";

  // determine number of blocks needed in grid based on element size
  const width = element.offsetWidth;
  const height = element.offsetHeight;
  const cols = Math.ceil(width / config.blockSize);
  const rows = Math.ceil(height / config.blockSize);

  const blocks = [];
  // loop thru each row and col and for every cell in the grid, create a new div element
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      const block = document.createElement("div");
      block.className = "grid-block";

      // add the randomness of empty blocks
      const isEmpty = Math.random() < config.emptyRatio;
      block.textContent = isEmpty ? "" : getRandomSymbol();

      // place block on the grid
      block.style.width = `${config.blockSize}px`;
      block.style.height = `${config.blockSize}px`;
      block.style.left = `${col * config.blockSize}px`;
      block.style.top = `${row * config.blockSize}px`;

      // append block to overlay container / add to DOM
      gridOverlay.appendChild(block);

      // push block meta-data to the blocks array; will be used when creating mouse hover/move interactions with each block
      blocks.push({
        element: block,
        x: col * config.blockSize + config.blockSize / 2,
        y: row * config.blockSize + config.blockSize / 2,
        gridX: col,
        gridY: row,
        highlightEndTime: 0,
        isEmpty: isEmpty,
        shouldScramble: !isEmpty && Math.random() < config.scrambleRatio,
        scrambleInterval: null,
      });
    }
  }
  // once all blocks are created, append the gridOverlay to the image-wrapper element, placing it 'above' the image and ready for interaction

  element.appendChild(gridOverlay);

  // add interactivity
  element.addEventListener("mousemove", (e) => {
    // calculate position of mouse in relation to the image -> this is ontop of the image layer, not the image itself
    const rect = element.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    // determine which grid block is closest to the mouse
    let closestBlock = null;
    let closestDistance = Infinity;

    // loop thru all the stored blocks and calc the distance between the mouse and the center of the block
    for (const block of blocks) {
      const dx = mouseX - block.x;
      const dy = mouseY - block.y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance < closestDistance) {
        closestDistance = distance;
        closestBlock = block;
      }
    }
    // return if not close to image
    if (!closestBlock || closestDistance > config.detectionRadius) return;

    const currentTime = Date.now();
    closestBlock.element.classList.add("active");
    closestBlock.highlightEndTime = currentTime + config.blockLifetime;

    if (closestBlock.shouldScramble && !closestBlock.scrambleInterval) {
      closestBlock.scrambleInterval = setInterval(() => {
        closestBlock.element.textContent = getRandomSymbol();
      }, config.scrambleInterval);
    }

    const clusterCount = Math.floor(Math.random() * config.clusterSize) + 1;
    let currentBlock = closestBlock;
    let activeBlocks = [closestBlock];

    for (let i = 0; i < clusterCount; i++) {
      const neighbors = blocks.filter((neighbor) => {
        if (activeBlocks.includes(neighbor)) return false;

        const dx = Math.abs(neighbor.gridX - closestBlock.gridX);
        const dy = Math.abs(neighbor.gridY - closestBlock.gridY);

        return dx <= 1 && dy <= 1;
      });

      if (neighbors.length === 0) break;

      const randomNeighbor =
        neighbors[Math.floor(Math.random() * neighbors.length)];
      randomNeighbor.element.classList.add("active");
      randomNeighbor.highlightEndTime =
        currentTime + config.blockLifetime + i * 10;

      if (randomNeighbor.shouldScramble && !randomNeighbor.scrambleInterval) {
        randomNeighbor.scrambleInterval = setInterval(() => {
          randomNeighbor.element.textContent = getRandomSymbol();
        }, config.scrambleInterval);
      }
      activeBlocks.push(randomNeighbor);
      currentBlock = randomNeighbor;
    }
  });

  // deactivate blocks = don't stay on the page after mouse has moved
  function updateHighlights() {
    const currentTime = Date.now();

    blocks.forEach((block) => {
      if (block.highlightEndTime > 0 && currentTime > block.highlightEndTime) {
        block.element.classList.remove("active");
        block.highlightEndTime = 0;

        if (block.scrambleInterval) {
          clearInterval(block.scrambleInterval);
          block.scrambleInterval = null;
          if (!block.isEmpty) {
            block.element.textContent = getRandomSymbol();
          }
        }
      }
    });
    requestAnimationFrame(updateHighlights);
  }

  updateHighlights();
}

document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll(".hover-img").forEach((element) => {
    initGridOverlay(element);
  });
});
