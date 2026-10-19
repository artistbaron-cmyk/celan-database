"""Compile the 36 Markdown lesson packs into a navigable, printable PDF."""

from __future__ import annotations

import html
import re
from pathlib import Path

import reportlab
from pypdf import PdfReader
from reportlab.lib import colors
from reportlab.lib.enums import TA_CENTER, TA_LEFT
from reportlab.lib.pagesizes import letter
from reportlab.lib.styles import ParagraphStyle
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.platypus import (
    BaseDocTemplate,
    Frame,
    LongTable,
    PageBreak,
    PageTemplate,
    Paragraph,
    Spacer,
    TableStyle,
)


ROOT = Path(__file__).resolve().parent
LESSONS = ROOT / "lessons"
OUTPUT = LESSONS / "CELAN_36_LESSON_PACKS.pdf"
PAGE_WIDTH, PAGE_HEIGHT = letter
MARGIN_X = 47
MARGIN_TOP = 49
MARGIN_BOTTOM = 47
CONTENT_WIDTH = PAGE_WIDTH - 2 * MARGIN_X

INK = colors.HexColor("#193347")
BLUE = colors.HexColor("#27627B")
MUTED = colors.HexColor("#61717D")
RULE = colors.HexColor("#D8E0E4")
PALE = colors.HexColor("#F2F6F7")

FONT_DIR = Path(reportlab.__file__).parent / "fonts"
pdfmetrics.registerFont(TTFont("Vera", str(FONT_DIR / "Vera.ttf")))
pdfmetrics.registerFont(TTFont("VeraBold", str(FONT_DIR / "VeraBd.ttf")))
pdfmetrics.registerFont(TTFont("VeraItalic", str(FONT_DIR / "VeraIt.ttf")))
pdfmetrics.registerFontFamily(
    "Vera", normal="Vera", bold="VeraBold", italic="VeraItalic", boldItalic="VeraBold"
)

STYLES = {
    "cover_title": ParagraphStyle(
        "CoverTitle", fontName="VeraBold", fontSize=28, leading=35,
        textColor=INK, spaceAfter=20,
    ),
    "cover_subtitle": ParagraphStyle(
        "CoverSubtitle", fontName="Vera", fontSize=13, leading=20,
        textColor=BLUE, spaceAfter=18,
    ),
    "cover_body": ParagraphStyle(
        "CoverBody", fontName="Vera", fontSize=10, leading=16,
        textColor=INK, spaceAfter=10,
    ),
    "contents_title": ParagraphStyle(
        "ContentsTitle", fontName="VeraBold", fontSize=18, leading=24,
        textColor=INK, spaceAfter=18,
    ),
    "lesson_title": ParagraphStyle(
        "LessonTitle", fontName="VeraBold", fontSize=17, leading=22,
        textColor=INK, spaceAfter=11, keepWithNext=True,
    ),
    "section": ParagraphStyle(
        "Section", fontName="VeraBold", fontSize=10.8, leading=14,
        textColor=BLUE, spaceBefore=10, spaceAfter=5, keepWithNext=True,
    ),
    "subsection": ParagraphStyle(
        "Subsection", fontName="VeraBold", fontSize=9.3, leading=12.2,
        textColor=BLUE, spaceBefore=6, spaceAfter=4, keepWithNext=True,
    ),
    "body": ParagraphStyle(
        "Body", fontName="Vera", fontSize=8.7, leading=12.6,
        textColor=INK, spaceAfter=6, allowWidows=0, allowOrphans=0,
    ),
    "meta": ParagraphStyle(
        "Meta", fontName="Vera", fontSize=7.9, leading=11.2,
        textColor=MUTED, spaceAfter=5,
    ),
    "list": ParagraphStyle(
        "List", fontName="Vera", fontSize=8.5, leading=11.9,
        textColor=INK, leftIndent=17, firstLineIndent=-15,
        spaceAfter=3.4, allowWidows=0, allowOrphans=0,
    ),
    "table_head": ParagraphStyle(
        "TableHead", fontName="VeraBold", fontSize=8.1, leading=11.3,
        textColor=INK,
    ),
    "table_cell": ParagraphStyle(
        "TableCell", fontName="Vera", fontSize=8.1, leading=11.3,
        textColor=INK,
    ),
    "toc_week": ParagraphStyle(
        "TocWeek", fontName="VeraBold", fontSize=8.8, leading=12,
        textColor=INK,
    ),
    "toc_lesson": ParagraphStyle(
        "TocLesson", fontName="Vera", fontSize=8.2, leading=11.5,
        textColor=INK,
    ),
}

INLINE_TOKEN = re.compile(r"(\[[^\]]+\]\([^)]+\)|\*\*.*?\*\*|`[^`]+`|\*[^*]+\*)")
LESSON_NAME = re.compile(r"week_(\d{2})_lesson_([abc])\.md$")


def inline_markup(value: str) -> str:
    """Render the small Markdown subset used by the lesson files."""
    pieces = []
    for part in INLINE_TOKEN.split(value):
        if not part:
            continue
        if part.startswith("[") and "](" in part and part.endswith(")"):
            label, target = part[1:-1].split("](", 1)
            pieces.append(
                f'<link href="{html.escape(target, quote=True)}" color="#27627B">'
                f"{inline_markup(label)}</link>"
            )
        elif part.startswith("**") and part.endswith("**"):
            pieces.append(f"<b>{inline_markup(part[2:-2])}</b>")
        elif part.startswith("`") and part.endswith("`"):
            pieces.append(
                f'<font name="Courier" color="#245A70">{html.escape(part[1:-1])}</font>'
            )
        elif part.startswith("*") and part.endswith("*"):
            pieces.append(f"<i>{inline_markup(part[1:-1])}</i>")
        else:
            pieces.append(html.escape(part))
    return "".join(pieces)


def paragraph(value: str, style: str = "body") -> Paragraph:
    return Paragraph(inline_markup(value), STYLES[style])


def table_cells(line: str) -> list[str]:
    return [cell.strip() for cell in line.strip().strip("|").split("|")]


def make_table(rows: list[list[str]]) -> LongTable:
    count = len(rows[0])
    widths = [CONTENT_WIDTH / count] * count
    cells = []
    for index, row in enumerate(rows):
        if len(row) != count:
            raise ValueError(f"Table has {len(row)} cells; expected {count}: {row}")
        style = "table_head" if index == 0 else "table_cell"
        cells.append([paragraph(cell, style) for cell in row])
    table = LongTable(cells, colWidths=widths, repeatRows=1, hAlign="LEFT")
    table.setStyle(TableStyle([
        ("BACKGROUND", (0, 0), (-1, 0), PALE),
        ("LINEBELOW", (0, 0), (-1, 0), 0.8, BLUE),
        ("LINEBELOW", (0, 1), (-1, -1), 0.3, RULE),
        ("VALIGN", (0, 0), (-1, -1), "TOP"),
        ("LEFTPADDING", (0, 0), (-1, -1), 7),
        ("RIGHTPADDING", (0, 0), (-1, -1), 7),
        ("TOPPADDING", (0, 0), (-1, -1), 5),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 5),
    ]))
    return table


def lesson_story(path: Path, bookmark: str) -> list:
    lines = path.read_text(encoding="utf-8").splitlines()
    story = []
    index = 0
    while index < len(lines):
        line = lines[index].strip()
        if not line:
            index += 1
            continue
        if line.startswith("# "):
            title = paragraph(line[2:], "lesson_title")
            title._bookmark_name = bookmark
            story.append(title)
            index += 1
            continue
        if line.startswith("## "):
            story.append(paragraph(line[3:], "section"))
            index += 1
            continue
        if line.startswith("### "):
            story.append(paragraph(line[4:], "subsection"))
            index += 1
            continue
        if line.startswith("|") and index + 1 < len(lines) and re.match(r"^\s*\|?\s*:?-{3,}", lines[index + 1]):
            rows = [table_cells(line)]
            index += 2
            while index < len(lines) and lines[index].lstrip().startswith("|"):
                rows.append(table_cells(lines[index]))
                index += 1
            story.extend([make_table(rows), Spacer(1, 5)])
            continue
        numbered = re.match(r"^(\d+)\.\s+(.+)$", line)
        bulleted = re.match(r"^[-*]\s+(.+)$", line)
        if numbered or bulleted:
            prefix = f"{numbered.group(1)}. " if numbered else "• "
            item = numbered.group(2) if numbered else bulleted.group(1)
            story.append(paragraph(prefix + item, "list"))
            index += 1
            continue
        parts = [line]
        index += 1
        while index < len(lines):
            next_line = lines[index].strip()
            if not next_line or next_line.startswith(("#", "|")) or re.match(r"^(?:\d+\.|[-*])\s+", next_line):
                break
            parts.append(next_line)
            index += 1
        combined = " ".join(parts)
        style = "meta" if combined.startswith(("**Source links:**", "**Grammar topics:**", "**Suggested session:**")) else "body"
        story.append(paragraph(combined, style))
    return story


class LessonPDF(BaseDocTemplate):
    def __init__(self, filename: str):
        super().__init__(
            filename, pagesize=letter,
            leftMargin=MARGIN_X, rightMargin=MARGIN_X,
            topMargin=MARGIN_TOP, bottomMargin=MARGIN_BOTTOM,
            title="Celan: 36 Lesson Packs", author="Celan",
            pageCompression=1,
        )
        frame = Frame(
            MARGIN_X, MARGIN_BOTTOM, CONTENT_WIDTH,
            PAGE_HEIGHT - MARGIN_TOP - MARGIN_BOTTOM,
            leftPadding=0, rightPadding=0, topPadding=0, bottomPadding=0,
        )
        self.addPageTemplates(PageTemplate(id="Lessons", frames=frame, onPage=self.draw_page))

    def draw_page(self, canvas, doc):
        canvas.setFillColor(colors.white)
        canvas.rect(0, 0, PAGE_WIDTH, PAGE_HEIGHT, stroke=0, fill=1)
        if doc.page == 1:
            canvas.setStrokeColor(BLUE)
            canvas.setLineWidth(2)
            canvas.line(MARGIN_X, PAGE_HEIGHT - 103, PAGE_WIDTH - MARGIN_X, PAGE_HEIGHT - 103)
            return
        canvas.setStrokeColor(RULE)
        canvas.setLineWidth(0.5)
        canvas.line(MARGIN_X, 35, PAGE_WIDTH - MARGIN_X, 35)
        canvas.setFont("Vera", 7.5)
        canvas.setFillColor(MUTED)
        canvas.drawString(MARGIN_X, 24, "CELAN  ·  36 LESSON PACKS")
        canvas.drawRightString(PAGE_WIDTH - MARGIN_X, 24, str(doc.page))

    def afterFlowable(self, flowable):
        bookmark = getattr(flowable, "_bookmark_name", None)
        if bookmark:
            self.canv.bookmarkPage(bookmark)
            self.canv.addOutlineEntry(flowable.getPlainText(), bookmark, level=0)


def main():
    paths = sorted(LESSONS.glob("week_*_lesson_*.md"))
    expected = {(week, letter) for week in range(1, 13) for letter in "abc"}
    actual = set()
    titles = {}
    for path in paths:
        match = LESSON_NAME.fullmatch(path.name)
        if not match:
            raise AssertionError(f"Unexpected lesson filename: {path.name}")
        key = (int(match.group(1)), match.group(2))
        actual.add(key)
        title = path.read_text(encoding="utf-8").splitlines()[0].removeprefix("# ")
        titles[key] = title
        source = path.read_text(encoding="utf-8")
        for required in ("## Model and explanation", "## Practice", "## Independent task", "## Hint", "## Answer key and feedback", "**Source links:**"):
            if required not in source:
                raise AssertionError(f"Missing {required} in {path.name}")
    if actual != expected or len(paths) != 36:
        raise AssertionError(f"Expected 36 lessons; missing={expected - actual}; extra={actual - expected}")

    story = [
        Spacer(1, 120),
        paragraph("Celan", "cover_subtitle"),
        paragraph("36 Lesson Packs", "cover_title"),
        paragraph("A 12 week course · three lessons per week", "cover_subtitle"),
        paragraph("Each lesson includes a model, a short explanation, practice, an independent task, a hint, an answer key, and source links.", "cover_body"),
        PageBreak(),
        paragraph("Contents", "contents_title"),
    ]
    toc = [[paragraph("Week", "table_head"), paragraph("Lessons", "table_head")]]
    for week in range(1, 13):
        links = []
        for letter in "abc":
            title = titles[(week, letter)].split(": ", 1)[1]
            links.append(f'<link href="#lesson-{week:02d}-{letter}" color="#27627B"><b>{letter.upper()}.</b> {html.escape(title)}</link>')
        toc.append([
            paragraph(str(week), "toc_week"),
            Paragraph("<br/>".join(links), STYLES["toc_lesson"]),
        ])
    contents = LongTable(toc, colWidths=[52, CONTENT_WIDTH - 52], repeatRows=1, hAlign="LEFT")
    contents.setStyle(TableStyle([
        ("BACKGROUND", (0, 0), (-1, 0), PALE),
        ("LINEBELOW", (0, 0), (-1, 0), 0.8, BLUE),
        ("LINEBELOW", (0, 1), (-1, -1), 0.3, RULE),
        ("VALIGN", (0, 0), (-1, -1), "TOP"),
        ("LEFTPADDING", (0, 0), (-1, -1), 7),
        ("RIGHTPADDING", (0, 0), (-1, -1), 7),
        ("TOPPADDING", (0, 0), (-1, -1), 6),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 6),
    ]))
    story.append(contents)

    for path in paths:
        match = LESSON_NAME.fullmatch(path.name)
        week, letter = int(match.group(1)), match.group(2)
        story.append(PageBreak())
        story.extend(lesson_story(path, f"lesson-{week:02d}-{letter}"))

    LessonPDF(str(OUTPUT)).build(story)
    reader = PdfReader(str(OUTPUT))
    pdf_text = "\n".join(page.extract_text() or "" for page in reader.pages)
    missing = [title for title in titles.values() if title not in pdf_text]
    if missing:
        raise AssertionError(f"Lesson titles missing in PDF: {missing}")
    print(f"Created {OUTPUT} ({len(reader.pages)} pages, {OUTPUT.stat().st_size:,} bytes)")


if __name__ == "__main__":
    main()
