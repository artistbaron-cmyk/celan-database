from __future__ import annotations

import csv
from dataclasses import dataclass
from pathlib import Path
from typing import Dict, List

from reportlab.lib import colors
from reportlab.lib.enums import TA_CENTER, TA_LEFT
from reportlab.lib.pagesizes import letter
from reportlab.lib.styles import ParagraphStyle, getSampleStyleSheet
from reportlab.lib.units import inch
from reportlab.platypus import (
    BaseDocTemplate,
    Frame,
    NextPageTemplate,
    PageBreak,
    PageTemplate,
    Paragraph,
    Spacer,
)


ROOT = Path("/Users/admin/Documents/CELAN_DATABASE")
CONCEPT_MAP = ROOT / "phrase_builder" / "concepts" / "concept_map.csv"
OUTPUT_DIR = ROOT / "phrase_builder" / "output"
PDF_PATH = OUTPUT_DIR / "celan_conceptual_architecture.pdf"


@dataclass
class ConceptEntry:
    concept_field: str
    purpose: str
    core_forms: str
    notes: str


GROUPS: List[Dict[str, object]] = [
    {
        "title": "Foundations of World and Meaning",
        "intro": "These fields hold the broad architecture of reality in Celan: element, truth, order, time, and the underlying shape of what is real.",
        "members": [
            "World and Element",
            "Truth, Balance, and Order",
            "Time, Memory, and History",
        ],
    },
    {
        "title": "Inner Life and Becoming",
        "intro": "These fields trace identity, longing, sorrow, peace, and the unseen life that moves underneath overt speech.",
        "members": [
            "Essence, Identity, and Inner Self",
            "Heart, Desire, and Longing",
            "Shadow, Mystery, and the Unseen",
            "Grief, Fear, and Adversity",
            "Peace, Relief, and Safety",
        ],
    },
    {
        "title": "Action, Making, and Expression",
        "intro": "These fields show how Celan treats motion, creation, breath, saying, and the shaping force of deliberate action.",
        "members": [
            "Action and Movement",
            "Creation and Crafting",
            "Speech, Breath, and Expression",
        ],
    },
    {
        "title": "Relation, Society, and Practice",
        "intro": "These fields govern belonging, protection, ritual, kinship, and the practical life of exchange and daily structure.",
        "members": [
            "Relation, Connection, and Belonging",
            "Strength, Endurance, and Protection",
            "Ritual, Sacred Action, and Ceremony",
            "Society, Kinship, and Social Role",
            "Trade, Measure, and Practical Life",
        ],
    },
    {
        "title": "Shaping Voices",
        "intro": "This final field marks the way one shared language is inhabited differently across Ohnosha through culture, sound, and metaphor.",
        "members": ["Cultural Voice"],
    },
]


def read_concepts(path: Path) -> Dict[str, ConceptEntry]:
    with path.open(newline="", encoding="utf-8") as fh:
        reader = csv.reader(fh)
        next(reader, None)
        concepts: Dict[str, ConceptEntry] = {}
        for row in reader:
            if not row:
                continue
            concept_field = ", ".join(part.strip() for part in row[:-3])
            purpose, core_forms, notes = row[-3:]
            concepts[concept_field] = ConceptEntry(
                concept_field=concept_field,
                purpose=purpose,
                core_forms=core_forms,
                notes=notes,
            )
        return concepts


def build_styles():
    styles = getSampleStyleSheet()
    styles.add(
        ParagraphStyle(
            name="DocTitle",
            parent=styles["Title"],
            fontName="Helvetica-Bold",
            fontSize=25,
            leading=29,
            alignment=TA_CENTER,
            textColor=colors.HexColor("#12263A"),
            spaceAfter=10,
        )
    )
    styles.add(
        ParagraphStyle(
            name="DocSubtitle",
            parent=styles["BodyText"],
            fontName="Helvetica",
            fontSize=12,
            leading=17,
            alignment=TA_CENTER,
            textColor=colors.HexColor("#5B6B7F"),
            spaceAfter=16,
        )
    )
    styles.add(
        ParagraphStyle(
            name="Intro",
            parent=styles["BodyText"],
            fontName="Helvetica",
            fontSize=11.5,
            leading=17,
            alignment=TA_LEFT,
            textColor=colors.HexColor("#30475E"),
            spaceAfter=10,
        )
    )
    styles.add(
        ParagraphStyle(
            name="SectionKicker",
            parent=styles["BodyText"],
            fontName="Helvetica-Bold",
            fontSize=10.5,
            leading=12,
            textColor=colors.HexColor("#9A6B1D"),
            spaceAfter=8,
            uppercase=True,
        )
    )
    styles.add(
        ParagraphStyle(
            name="SectionTitle",
            parent=styles["Heading1"],
            fontName="Helvetica-Bold",
            fontSize=17,
            leading=21,
            textColor=colors.HexColor("#17324D"),
            spaceBefore=2,
            spaceAfter=8,
        )
    )
    styles.add(
        ParagraphStyle(
            name="SectionIntro",
            parent=styles["BodyText"],
            fontName="Helvetica",
            fontSize=10.7,
            leading=15,
            textColor=colors.HexColor("#506070"),
            spaceAfter=14,
        )
    )
    styles.add(
        ParagraphStyle(
            name="CardTitle",
            parent=styles["Heading2"],
            fontName="Helvetica-Bold",
            fontSize=13.2,
            leading=16,
            textColor=colors.HexColor("#17324D"),
            spaceAfter=6,
        )
    )
    styles.add(
        ParagraphStyle(
            name="CardBody",
            parent=styles["BodyText"],
            fontName="Helvetica",
            fontSize=10.3,
            leading=14.4,
            textColor=colors.HexColor("#2B3E50"),
            spaceAfter=6,
        )
    )
    styles.add(
        ParagraphStyle(
            name="CardMeta",
            parent=styles["BodyText"],
            fontName="Helvetica-Bold",
            fontSize=9.4,
            leading=12.4,
            textColor=colors.HexColor("#2C7A5A"),
            spaceAfter=6,
        )
    )
    styles.add(
        ParagraphStyle(
            name="CardNote",
            parent=styles["BodyText"],
            fontName="Helvetica-Oblique",
            fontSize=9.5,
            leading=13.2,
            textColor=colors.HexColor("#607082"),
            spaceAfter=10,
        )
    )
    return styles


def first_page(canvas, doc):
    canvas.saveState()
    width, height = letter
    canvas.setFillColor(colors.HexColor("#F5F7FA"))
    canvas.rect(0, 0, width, height, fill=1, stroke=0)
    canvas.setStrokeColor(colors.HexColor("#D7DEE8"))
    canvas.setLineWidth(1)
    canvas.line(0.9 * inch, 1.1 * inch, width - 0.9 * inch, 1.1 * inch)
    canvas.setFillColor(colors.HexColor("#6B7A8E"))
    canvas.setFont("Helvetica", 9)
    canvas.drawString(0.95 * inch, 0.78 * inch, "CELAN DATABASE")
    canvas.drawRightString(width - 0.95 * inch, 0.78 * inch, "Concept Layer Companion")
    canvas.restoreState()


def later_pages(canvas, doc):
    canvas.saveState()
    width, height = letter
    canvas.setStrokeColor(colors.HexColor("#D7DEE8"))
    canvas.setLineWidth(0.8)
    canvas.line(0.75 * inch, height - 0.68 * inch, width - 0.75 * inch, height - 0.68 * inch)
    canvas.setFillColor(colors.HexColor("#6B7A8E"))
    canvas.setFont("Helvetica", 9)
    canvas.drawString(0.78 * inch, height - 0.55 * inch, "The Conceptual Architecture of Celan")
    canvas.drawRightString(width - 0.78 * inch, height - 0.55 * inch, f"Page {doc.page}")
    canvas.restoreState()


def add_cover(story, styles):
    story.append(Spacer(1, 1.45 * inch))
    story.append(Paragraph("The Conceptual Architecture of Celan", styles["DocTitle"]))
    story.append(
        Paragraph(
            "A first-pass map of the deeper meaning fields that the canon keeps returning to.",
            styles["DocSubtitle"],
        )
    )
    story.append(Spacer(1, 0.35 * inch))
    story.append(
        Paragraph(
            "This document is not a replacement for the dictionary or the grammar guide. "
            "It is a companion reading layer: a way of seeing the meaning-world underneath the words. "
            "Where the dictionary names individual forms and the guide explains how the language moves, "
            "this map traces the larger conceptual fields that give Celan its philosophical shape.",
            styles["Intro"],
        )
    )
    story.append(
        Paragraph(
            "Taken together, these fields suggest that Celan is not only a vocabulary system but a patterned worldview. "
            "Element, relation, ritual, longing, craft, truth, and cultural voice keep interweaving through the canon. "
            "This map gathers that architecture into one place so it can be read, felt, and worked with more coherently.",
            styles["Intro"],
        )
    )
    story.append(NextPageTemplate("Later"))
    story.append(PageBreak())


def concept_card(entry: ConceptEntry, styles):
    parts = [
        Paragraph(entry.concept_field, styles["CardTitle"]),
        Paragraph(entry.purpose, styles["CardBody"]),
        Paragraph(f"<b>Core forms</b>  {entry.core_forms}", styles["CardMeta"]),
        Paragraph(entry.notes, styles["CardNote"]),
    ]
    return parts


def build_story(concepts: Dict[str, ConceptEntry], styles):
    story = []
    add_cover(story, styles)

    for group in GROUPS:
        story.append(Paragraph("CONCEPT FIELD", styles["SectionKicker"]))
        story.append(Paragraph(group["title"], styles["SectionTitle"]))
        story.append(Paragraph(group["intro"], styles["SectionIntro"]))
        for member in group["members"]:
            story.extend(concept_card(concepts[member], styles))
            story.append(Spacer(1, 0.08 * inch))
        story.append(Spacer(1, 0.18 * inch))
    return story


def build_pdf():
    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)
    concepts = read_concepts(CONCEPT_MAP)
    styles = build_styles()

    doc = BaseDocTemplate(
        str(PDF_PATH),
        pagesize=letter,
        leftMargin=0.85 * inch,
        rightMargin=0.85 * inch,
        topMargin=0.8 * inch,
        bottomMargin=0.8 * inch,
        title="The Conceptual Architecture of Celan",
        author="OpenAI Codex",
    )

    frame = Frame(doc.leftMargin, doc.bottomMargin, doc.width, doc.height, id="normal")
    first = PageTemplate(id="First", frames=[frame], onPage=first_page)
    later = PageTemplate(id="Later", frames=[frame], onPage=later_pages)
    doc.addPageTemplates([first, later])

    story = build_story(concepts, styles)
    doc.build(story)
    return PDF_PATH


if __name__ == "__main__":
    out = build_pdf()
    print(out)
