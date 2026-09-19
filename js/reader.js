/* =========================================================
   Digital Book Collection — Reader with Highlights
   Author: Altyn Abdinurova | Group: SE-2513
   ========================================================= */
(function () {
  const KEY_HL   = 'bc_reader_highlights';
  const KEY_BM   = 'bc_reader_bookmarks';
  const KEY_LAST = 'bc_reader_last_book';

  const $ = (id) => document.getElementById(id);
  const getHL = () => JSON.parse(localStorage.getItem(KEY_HL) || '[]');
  const setHL = (a) => localStorage.setItem(KEY_HL, JSON.stringify(a));
  const getBM = () => JSON.parse(localStorage.getItem(KEY_BM) || '[]');
  const setBM = (a) => localStorage.setItem(KEY_BM, JSON.stringify(a));

  function escapeHtml(s) {
    return String(s).replace(/[&<>"']/g,
      (c) => ({ '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;' }[c]));
  }

  /* ===== Public-domain book excerpts (Project Gutenberg) ===== */
  const BOOKS = {
    pride: {
      title: 'Pride and Prejudice',
      author: 'Jane Austen · 1813',
      cover: 'imgs/pride.jpg',
      paragraphs: [
        "It is a truth universally acknowledged, that a single man in possession of a good fortune, must be in want of a wife.",
        "However little known the feelings or views of such a man may be on his first entering a neighbourhood, this truth is so well fixed in the minds of the surrounding families, that he is considered as the rightful property of some one or other of their daughters.",
        "\"My dear Mr. Bennet,\" said his lady to him one day, \"have you heard that Netherfield Park is let at last?\"",
        "Mr. Bennet replied that he had not.",
        "\"But it is,\" returned she; \"for Mrs. Long has just been here, and she told me all about it.\"",
        "Mr. Bennet made no answer.",
        "\"Do you not want to know who has taken it?\" cried his wife impatiently.",
        "\"You want to tell me, and I have no objection to hearing it.\"",
        "This was invitation enough.",
        "\"Why, my dear, you must know, Mrs. Long says that Netherfield is taken by a young man of large fortune from the north of England; that he came down on Monday in a chaise and four to see the place, and was so much delighted with it, that he agreed with Mr. Morris immediately.\""
      ]
    },
    alice: {
      title: 'Alice in Wonderland',
      author: 'Lewis Carroll · 1865',
      cover: 'imgs/alice.jpg',
      paragraphs: [
        "Alice was beginning to get very tired of sitting by her sister on the bank, and of having nothing to do: once or twice she had peeped into the book her sister was reading, but it had no pictures or conversations in it, 'and what is the use of a book,' thought Alice 'without pictures or conversations?'",
        "So she was considering in her own mind (as well as she could, for the hot day made her feel very sleepy and stupid), whether the pleasure of making a daisy-chain would be worth the trouble of getting up and picking the daisies, when suddenly a White Rabbit with pink eyes ran close by her.",
        "There was nothing so very remarkable in that; nor did Alice think it so very much out of the way to hear the Rabbit say to itself, 'Oh dear! Oh dear! I shall be late!'",
        "But when the Rabbit actually took a watch out of its waistcoat-pocket, and looked at it, and then hurried on, Alice started to her feet, for it flashed across her mind that she had never before seen a rabbit with either a waistcoat-pocket, or a watch to take out of it.",
        "And burning with curiosity, she ran across the field after it, and fortunately was just in time to see it pop down a large rabbit-hole under the hedge.",
        "In another moment down went Alice after it, never once considering how in the world she was to get out again.",
        "The rabbit-hole went straight on like a tunnel for some way, and then dipped suddenly down, so suddenly that Alice had not a moment to think about stopping herself before she found herself falling down a very deep well."
      ]
    },
    sherlock: {
      title: 'A Scandal in Bohemia',
      author: 'Arthur Conan Doyle · 1891',
      cover: 'imgs/sherlock.jpg',
      paragraphs: [
        "To Sherlock Holmes she is always the woman. I have seldom heard him mention her under any other name. In his eyes she eclipses and predominates the whole of her sex.",
        "It was not that he felt any emotion akin to love for Irene Adler. All emotions, and that one particularly, were abhorrent to his cold, precise but admirably balanced mind.",
        "He was, I take it, the most perfect reasoning and observing machine that the world has seen, but as a lover he would have placed himself in a false position.",
        "He never spoke of the softer passions, save with a gibe and a sneer. They were admirable things for the observer—excellent for drawing the veil from men's motives and actions.",
        "But for the trained reasoner to admit such intrusions into his own delicate and finely adjusted temperament was to introduce a distracting factor which might throw a doubt upon all his mental results.",
        "Grit in a sensitive instrument, or a crack in one of his own high-power lenses, would not be more disturbing than a strong emotion in a nature such as his.",
        "And yet there was but one woman to him, and that woman was the late Irene Adler, of dubious and questionable memory."
      ]
    },
    frankenstein: {
      title: 'Frankenstein',
      author: 'Mary Shelley · 1818',
      cover: 'imgs/frankenstein.jpg',
      paragraphs: [
        "You will rejoice to hear that no disaster has accompanied the commencement of an enterprise which you have regarded with such evil forebodings.",
        "I arrived here yesterday, and my first task is to assure my dear sister of my welfare and increasing confidence in the success of my undertaking.",
        "I am already far north of London, and as I walk in the streets of Petersburgh, I feel a cold northern breeze play upon my cheeks, which braces my nerves and fills me with delight.",
        "Do you understand this feeling? This breeze, which has travelled from the regions towards which I am advancing, gives me a foretaste of those icy climes.",
        "Inspirited by this wind of promise, my daydreams become more fervent and vivid. I try in vain to be persuaded that the pole is the seat of frost and desolation; it ever presents itself to my imagination as the region of beauty and delight.",
        "There, Margaret, the sun is for ever visible, its broad disk just skirting the horizon and diffusing a perpetual splendour."
      ]
    },
    gatsby: {
      title: 'The Great Gatsby',
      author: 'F. Scott Fitzgerald · 1925',
      cover: 'imgs/gatsby.jpg',
      paragraphs: [
        "In my younger and more vulnerable years my father gave me some advice that I've been turning over in my mind ever since.",
        "\"Whenever you feel like criticizing any one,\" he told me, \"just remember that all the people in this world haven't had the advantages that you've had.\"",
        "He didn't say any more, but we've always been unusually communicative in a reserved way, and I understood that he meant a great deal more than that.",
        "In consequence, I'm inclined to reserve all judgments, a habit that has opened up many curious natures to me and also made me the victim of not a few veteran bores.",
        "The abnormal mind is quick to detect and attach itself to this quality when it appears in a normal person, and so it came about that in college I was unjustly accused of being a politician, because I was privy to the secret griefs of wild, unknown men."
      ]
    }
  };

  let currentBook = localStorage.getItem(KEY_LAST) || 'pride';
  if (!BOOKS[currentBook]) currentBook = 'pride';

  /* ===== Render book ===== */
  function renderBook() {
    const book = BOOKS[currentBook];
    const container = $('book-reader');
    if (!container) return;
    let html = `
      <header class="reader-header">
        <img src="${book.cover}" alt="${escapeHtml(book.title)} cover">
        <div>
          <h1>${escapeHtml(book.title)}</h1>
          <p>${escapeHtml(book.author)} · Public Domain</p>
        </div>
      </header>`;
    book.paragraphs.forEach((text, i) => {
      html += `<p class="reader-para" data-para-id="${i}" id="para-${i}">${escapeHtml(text)}</p>`;
    });
    container.innerHTML = html;
    applyHighlights();
  }

  /* ===== Apply highlights to paragraphs ===== */
  function applyHighlights() {
    const book = BOOKS[currentBook];
    const hls = getHL().filter((h) => h.book === currentBook);

    document.querySelectorAll('.reader-para').forEach((p) => {
      const id = parseInt(p.dataset.paraId, 10);
      const text = book.paragraphs[id];
      const paraHLs = hls
        .filter((h) => h.paraId === id)
        .sort((a, b) => a.start - b.start);

      let html = '';
      let cursor = 0;
      for (const h of paraHLs) {
        if (h.start > cursor) html += escapeHtml(text.slice(cursor, h.start));
        html += `<mark class="hl hl-${h.color}" data-hl-id="${h.id}">${escapeHtml(text.slice(h.start, h.end))}</mark>`;
        cursor = Math.max(cursor, h.end);
      }
      if (cursor < text.length) html += escapeHtml(text.slice(cursor));
      p.innerHTML = html || escapeHtml(text);
    });
  }

  /* ===== Highlight current selection ===== */
  function highlightSelection(color) {
    const sel = window.getSelection();
    if (!sel.rangeCount || sel.isCollapsed) {
      alert('Select some text in the book first, then click a color.');
      return;
    }
    const range = sel.getRangeAt(0);
    const startNode = range.startContainer;
    const endNode = range.endContainer;
    const startEl = startNode.nodeType === 3 ? startNode.parentElement : startNode;
    const endEl = endNode.nodeType === 3 ? endNode.parentElement : endNode;
    const p = startEl.closest('.reader-para');
    const endP = endEl.closest('.reader-para');

    if (!p || p !== endP) {
      alert('Select text within a single paragraph.');
      return;
    }

    const paraId = parseInt(p.dataset.paraId, 10);
    const fullText = BOOKS[currentBook].paragraphs[paraId];

    // Offsets within the paragraph
    const preRange = range.cloneRange();
    preRange.selectNodeContents(p);
    preRange.setEnd(startNode, range.startOffset);
    const start = preRange.toString().length;
    const selected = range.toString();
    const end = start + selected.length;

    if (start === end) return;

    const hls = getHL();
    const overlap = hls.some(
      (h) => h.book === currentBook && h.paraId === paraId &&
             !(h.end <= start || h.start >= end)
    );
    if (overlap) {
      alert('This range already has a highlight.');
      return;
    }

    hls.push({
      id: 'hl_' + Date.now(),
      book: currentBook,
      paraId,
      start,
      end,
      text: selected,
      color,
      createdAt: Date.now()
    });
    setHL(hls);
    sel.removeAllRanges();
    applyHighlights();
    renderSidebar();
  }

  /* ===== Bookmark nearest-to-center paragraph ===== */
  function bookmarkCurrentParagraph() {
    const paras = [...document.querySelectorAll('.reader-para')];
    if (!paras.length) return;
    const centerY = window.innerHeight / 2;
    let nearest = paras[0];
    let min = Infinity;
    for (const p of paras) {
      const r = p.getBoundingClientRect();
      const dist = Math.abs((r.top + r.bottom) / 2 - centerY);
      if (dist < min) { min = dist; nearest = p; }
    }
    const paraId = parseInt(nearest.dataset.paraId, 10);
    const text = BOOKS[currentBook].paragraphs[paraId];

    const bms = getBM();
    if (bms.some((b) => b.book === currentBook && b.paraId === paraId)) {
      alert('This paragraph is already bookmarked.');
      return;
    }
    bms.push({
      id: 'bm_' + Date.now(),
      book: currentBook,
      paraId,
      preview: text.slice(0, 90) + (text.length > 90 ? '…' : ''),
      createdAt: Date.now()
    });
    setBM(bms);
    renderSidebar();
    alert('Bookmarked! 🔖');
  }

  /* ===== Sidebar ===== */
  function renderSidebar() {
    const bmList = $('bookmark-list');
    const hlList = $('highlight-list');
    if (!bmList || !hlList) return;

    const bms = getBM().filter((b) => b.book === currentBook);
    const hls = getHL().filter((h) => h.book === currentBook);

    bmList.innerHTML = bms.length
      ? bms.map((b) => `
          <li class="side-link" data-para="${b.paraId}">
            🔖 <span class="side-text">${escapeHtml(b.preview)}</span>
            <button class="side-remove" data-remove-bm="${b.id}" title="Remove">✕</button>
          </li>`).join('')
      : '<li class="empty-msg-small">No bookmarks yet</li>';

    hlList.innerHTML = hls.length
      ? hls.map((h) => `
          <li class="side-link" data-para="${h.paraId}">
            <span class="swatch swatch-${h.color}"></span>
            <span class="side-text">${escapeHtml(h.text.slice(0, 60))}${h.text.length > 60 ? '…' : ''}</span>
            <button class="side-remove" data-remove-hl="${h.id}" title="Remove">✕</button>
          </li>`).join('')
      : '<li class="empty-msg-small">No highlights yet</li>';

    // Click scroll
    document.querySelectorAll('.side-link').forEach((el) => {
      el.addEventListener('click', (e) => {
        if (e.target.closest('.side-remove')) return;
        const paraId = parseInt(el.dataset.para, 10);
        const p = document.getElementById('para-' + paraId);
        if (p) {
          p.scrollIntoView({ behavior: 'smooth', block: 'center' });
          p.classList.add('flash');
          setTimeout(() => p.classList.remove('flash'), 1600);
        }
      });
    });

    // Remove bookmark
    document.querySelectorAll('[data-remove-bm]').forEach((btn) => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        setBM(getBM().filter((b) => b.id !== btn.dataset.removeBm));
        renderSidebar();
      });
    });

    // Remove highlight
    document.querySelectorAll('[data-remove-hl]').forEach((btn) => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        setHL(getHL().filter((h) => h.id !== btn.dataset.removeHl));
        applyHighlights();
        renderSidebar();
      });
    });
  }

  /* ===== Init ===== */
  document.addEventListener('DOMContentLoaded', () => {
    const sel = $('book-select');
    if (sel) {
      Object.entries(BOOKS).forEach(([id, b]) => {
        const opt = document.createElement('option');
        opt.value = id;
        opt.textContent = b.title + ' — ' + b.author.split('·')[0].trim();
        if (id === currentBook) opt.selected = true;
        sel.appendChild(opt);
      });

      sel.addEventListener('change', (e) => {
        currentBook = e.target.value;
        localStorage.setItem(KEY_LAST, currentBook);
        renderBook();
        renderSidebar();
        window.scrollTo({ top: 0, behavior: 'smooth' });
      });
    }

    document.querySelectorAll('.hl-btn').forEach((btn) => {
      btn.addEventListener('click', () => highlightSelection(btn.dataset.color));
    });

    const bmBtn = $('bookmark-btn');
    if (bmBtn) bmBtn.addEventListener('click', bookmarkCurrentParagraph);

    const clrBtn = $('clear-highlights');
    if (clrBtn) {
      clrBtn.addEventListener('click', () => {
        if (!confirm('Clear all highlights and bookmarks for this book?')) return;
        setHL(getHL().filter((h) => h.book !== currentBook));
        setBM(getBM().filter((b) => b.book !== currentBook));
        applyHighlights();
        renderSidebar();
      });
    }

    renderBook();
    renderSidebar();
  });
})();