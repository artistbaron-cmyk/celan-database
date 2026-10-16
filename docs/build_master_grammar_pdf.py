"""Build the readable PDF edition of the Celan master grammar guide.

Run with a Python environment that has reportlab and pypdf installed.
The Markdown document is the source; this script does not change it.
"""

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


HERE = Path(__file__).resolve().parent
SOURCE = HERE / "CELAN_MASTER_GRAMMAR_GUIDE.md"
OUTPUT = HERE / "CELAN_MASTER_GRAMMAR_GUIDE.pdf"
PAGE_WIDTH, PAGE_HEIGHT = letter
MARGIN_X = 53
MARGIN_TOP = 55
MARGIN_BOTTOM = 54
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
        "CoverTitle", fontName="VeraBold", fontSize=29, leading=37,
        textColor=INK, spaceAfter=24, alignment=TA_LEFT,
    ),
    "cover_meta": ParagraphStyle(
        "CoverMeta", fontName="Vera", fontSize=11, leading=17,
        textColor=BLUE, spaceAfter=26,
    ),
    "cover_intro": ParagraphStyle(
        "CoverIntro", fontName="Vera", fontSize=12, leading=19,
        textColor=INK, spaceAfter=14,
    ),
    "h2": ParagraphStyle(
        "Chapter", fontName="VeraBold", fontSize=17, leading=22,
        textColor=INK, spaceAfter=18, keepWithNext=True,
    ),
    "h3": ParagraphStyle(
        "Section", fontName="VeraBold", fontSize=12.4, leading=17,
        textColor=BLUE, spaceBefore=14, spaceAfter=8, keepWithNext=True,
    ),
    "body": ParagraphStyle(
        "Body", fontName="Vera", fontSize=9.35, leading=14.2,
        textColor=INK, spaceAfter=9, allowWidows=0, allowOrphans=0,
    ),
    "contents": ParagraphStyle(
        "Contents", fontName="Vera", fontSize=10.5, leading=17,
        textColor=INK, leftIndent=8, spaceAfter=4,
    ),
    "list": ParagraphStyle(
        "List", fontName="Vera", fontSize=9.35, leading=14.2,
        textColor=INK, leftIndent=16, firstLineIndent=-14,
        spaceAfter=6, allowWidows=0, allowOrphans=0,
    ),
    "quote": ParagraphStyle(
        "Quote", fontName="Vera", fontSize=9.1, leading=13.8,
        textColor=INK,
    ),
    "table_head": ParagraphStyle(
        "TableHead", fontName="VeraBold", fontSize=8.1, leading=11.2,
        textColor=INK,
    ),
    "table_cell": ParagraphStyle(
        "TableCell", fontName="Vera", fontSize=8.1, leading=11.2,
        textColor=INK,
    ),
}

INLINE_TOKEN = re.compile(r"(\[[^\]]+\]\([^)]+\)|\*\*.*?\*\*|`[^`]+`|\*[^*]+\*)")


def inline_markup(value: str) -> str:
    """Translate the guide's inline Markdown to ReportLab paragraph markup."""
    pieces = []
    for part in INLINE_TOKEN.split(value):
        if not part:
            continue
        if part.startswith("[") and "](" in part and part.endswith(")"):
            label, target = part[1:-1].split("](", 1)
            if target.startswith("#"):
                pieces.append(
                    f'<link href="{html.escape(target, quote=True)}" color="#27627B">'
                    f"{inline_markup(label)}</link>"
                )
            else:
                pieces.append(inline_markup(label))
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


def plain(value: str) -> str:
    value = re.sub(r"\[([^\]]+)\]\([^)]+\)", r"\1", value)
    return re.sub(r"[`*_]", "", value)


def slug(value: str) -> str:
    value = plain(value).lower()
    value = re.sub(r"[^\w\- ]", "", value)
    return re.sub(r" +", "-", value)


def paragraph(value: str, style: str = "body") -> Paragraph:
    return Paragraph(inline_markup(value), STYLES[style])


def make_table(rows: list[list[str]]) -> LongTable:
    count = len(rows[0])
    proportions = {
        2: [0.43, 0.57],
        3: [0.28, 0.30, 0.42],
        4: [0.21, 0.24, 0.25, 0.30],
    }.get(count, [1 / count] * count)
    widths = [CONTENT_WIDTH * portion for portion in proportions]
    cells = []
    for index, row in enumerate(rows):
        if len(row) != count:
            raise ValueError(f"Table has {len(row)} cells; expected {count}: {row}")
        cell_style = "table_head" if index == 0 else "table_cell"
        cells.append([paragraph(cell, cell_style) for cell in row])
    table = LongTable(cells, colWidths=widths, repeatRows=1, hAlign="LEFT")
    table.setStyle(
        TableStyle(
            [
                ("BACKGROUND", (0, 0), (-1, 0), PALE),
                ("ROWBACKGROUNDS", (0, 1), (-1, -1), [colors.white, colors.HexColor("#FAFCFC")]),
                ("LINEBELOW", (0, 0), (-1, 0), 0.8, BLUE),
                ("LINEBELOW", (0, 1), (-1, -1), 0.35, RULE),
                ("VALIGN", (0, 0), (-1, -1), "TOP"),
                ("LEFTPADDING", (0, 0), (-1, -1), 6),
                ("RIGHTPADDING", (0, 0), (-1, -1), 6),
                ("TOPPADDING", (0, 0), (-1, -1), 6),
                ("BOTTOMPADDING", (0, 0), (-1, -1), 6),
            ]
        )
    )
    return table


def make_quote(lines: list[str]) -> LongTable:
    """Lay out examples with a side rule and measured padding around the text."""
    rows = [[paragraph(line, "quote")] for line in lines]
    table = LongTable(rows, colWidths=[CONTENT_WIDTH], hAlign="LEFT")
    table.setStyle(
        TableStyle(
            [
                ("BACKGROUND", (0, 0), (-1, -1), PALE),
                ("LINEBEFORE", (0, 0), (0, -1), 2, BLUE),
                ("LEFTPADDING", (0, 0), (-1, -1), 13),
                ("RIGHTPADDING", (0, 0), (-1, -1), 10),
                ("TOPPADDING", (0, 0), (-1, -1), 7),
                ("BOTTOMPADDING", (0, 0), (-1, -1), 7),
            ]
        )
    )
    return table


def table_cells(line: str) -> list[str]:
    return [cell.strip() for cell in line.strip().strip("|").split("|")]


def is_table_rule(line: str) -> bool:
    return bool(re.match(r"^\s*\|?\s*:?-{3,}", line))


def parse_story(source: str) -> list:
    lines = source.splitlines()
    title = lines[0].removeprefix("# ")
    meta = lines[2]
    intro = lines[4]
    story = [
        Spacer(1, 112),
        paragraph(title, "cover_title"),
        paragraph(meta, "cover_meta"),
        paragraph(intro, "cover_intro"),
        PageBreak(),
    ]

    index = lines.index("## Contents")
    while index < len(lines):
        line = lines[index]
        if not line.strip():
            index += 1
            continue

        heading = re.match(r"^(#{2,3})\s+(.+)$", line)
        if heading:
            level, title = heading.groups()
            if level == "##" and title != "Contents":
                story.append(PageBreak())
            flow = paragraph(title, "h2" if level == "##" else "h3")
            flow._bookmark_name = slug(title)
            flow._outline_level = 0 if level == "##" and title != "Contents" else None
            story.append(flow)
            index += 1
            continue

        if line.lstrip().startswith("|") and index + 1 < len(lines) and is_table_rule(lines[index + 1]):
            rows = [table_cells(line)]
            index += 2
            while index < len(lines) and lines[index].lstrip().startswith("|"):
                rows.append(table_cells(lines[index]))
                index += 1
            story.extend([make_table(rows), Spacer(1, 12)])
            continue

        if line.startswith(">"):
            quote_lines = []
            while index < len(lines) and lines[index].startswith(">"):
                content = lines[index].removeprefix(">").strip()
                quote_lines.append(content)
                index += 1
            story.extend([make_quote(quote_lines), Spacer(1, 10)])
            continue

        numbered = re.match(r"^(\d+)\.\s+(.+)$", line)
        bulleted = re.match(r"^[-*]\s+(.+)$", line)
        if numbered or bulleted:
            prefix = f"{numbered.group(1)}. " if numbered else "• "
            item = numbered.group(2) if numbered else bulleted.group(1)
            style = "contents" if index < lines.index("## 1. Sound and pronunciation") else "list"
            story.append(paragraph(prefix + item, style))
            index += 1
            continue

        parts = [line.strip()]
        index += 1
        while index < len(lines):
            next_line = lines[index]
            if not next_line.strip() or re.match(r"^#{2,3}\s+", next_line) or next_line.startswith(">"):
                break
            if next_line.lstrip().startswith("|") or re.match(r"^(?:\d+\.|[-*])\s+", next_line):
                break
            parts.append(next_line.strip())
            index += 1
        story.append(paragraph(" ".join(parts)))

    return story


class GrammarPDF(BaseDocTemplate):
    def __init__(self, filename: str):
        super().__init__(
            filename,
            pagesize=letter,
            leftMargin=MARGIN_X,
            rightMargin=MARGIN_X,
            topMargin=MARGIN_TOP,
            bottomMargin=MARGIN_BOTTOM,
            title="Celan: Master Grammar Guide",
            author="Celan",
            pageCompression=1,
        )
        frame = Frame(
            MARGIN_X, MARGIN_BOTTOM, CONTENT_WIDTH,
            PAGE_HEIGHT - MARGIN_TOP - MARGIN_BOTTOM,
            leftPadding=0, rightPadding=0, topPadding=0, bottomPadding=0,
        )
        self.addPageTemplates(PageTemplate(id="Guide", frames=frame, onPage=self.draw_page))

    def draw_page(self, canvas, doc):
        canvas.setFillColor(colors.white)
        canvas.rect(0, 0, PAGE_WIDTH, PAGE_HEIGHT, stroke=0, fill=1)
        if doc.page == 1:
            canvas.setStrokeColor(BLUE)
            canvas.setLineWidth(2)
            canvas.line(MARGIN_X, PAGE_HEIGHT - 105, PAGE_WIDTH - MARGIN_X, PAGE_HEIGHT - 105)
            return
        canvas.setStrokeColor(RULE)
        canvas.setLineWidth(0.5)
        canvas.line(MARGIN_X, 38, PAGE_WIDTH - MARGIN_X, 38)
        canvas.setFont("Vera", 8)
        canvas.setFillColor(MUTED)
        canvas.drawString(MARGIN_X, 26, "CELAN  ·  MASTER GRAMMAR GUIDE")
        canvas.drawRightString(PAGE_WIDTH - MARGIN_X, 26, str(doc.page))

    def afterFlowable(self, flowable):
        key = getattr(flowable, "_bookmark_name", None)
        if key:
            self.canv.bookmarkPage(key)
            if getattr(flowable, "_outline_level", None) is not None:
                self.canv.addOutlineEntry(plain(flowable.getPlainText()), key, level=0)


def main():
    source = SOURCE.read_text(encoding="utf-8")
    story = parse_story(source)
    GrammarPDF(str(OUTPUT)).build(story)
    reader = PdfReader(str(OUTPUT))
    pdf_text = "\n".join(page.extract_text() for page in reader.pages)
    chapter_titles = re.findall(r"^## (\d+\. .+)$", source, re.MULTILINE)
    missing = [title for title in chapter_titles if plain(title) not in pdf_text]
    if missing:
        raise AssertionError(f"Missing chapter titles in PDF: {missing}")
    print(f"Created {OUTPUT} ({len(reader.pages)} pages, {OUTPUT.stat().st_size:,} bytes)")


if __name__ == "__main__":
    main()
