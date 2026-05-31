# System Map

The CELAN Database project now has a few distinct layers. They are related, but they do different jobs.

## 1. Site layer

This is the part a user actually sees inside the app.

The main surface lives in:

- `/Users/admin/Documents/CELAN_DATABASE/dictionary/`

That surface currently includes:

- `Dictionary`
- `Grammar Guide`
- `Phrase Builder`

## 2. Data layer

This is where the structured source and export files live.

The main folder is:

- `/Users/admin/Documents/CELAN_DATABASE/data/`

This includes things like:

- dictionary exports
- grammar rule CSVs
- reporting files
- batched outputs

## 3. Phrase Builder support layer

This is the backstage system being built to support future phrase work.

The main folder is:

- `/Users/admin/Documents/CELAN_DATABASE/phrase_builder/`

This includes:

- phrasebank
- concepts
- evaluation
- retrieval
- docs
- output

This layer is not the finished builder. It is the support structure being prepared around it.

## 4. Source and reference layer

The project also contains upstream material and working references, including folders such as:

- `/Users/admin/Documents/CELAN_DATABASE/source_pdfs/`
- `/Users/admin/Documents/CELAN_DATABASE/source_texts/`
- `/Users/admin/Documents/CELAN_DATABASE/knowledgebase/`
- `/Users/admin/Documents/CELAN_DATABASE/learning_center/`

These help feed the system, but they are not the same thing as the app-facing surfaces.

## 5. Backup layer

There is also a backup area:

- `/Users/admin/Documents/CELAN_DATABASE/backup/`

This exists for preservation, not daily editing.

## Why this split matters

The project works better when each layer is allowed to do its own job.

For example:

- the site layer should feel clear and usable
- the data layer should stay structured
- the Phrase Builder layer should stay supportive and legible
- the source layer should remain a grounding reference

When those jobs blur together, the project starts feeling heavier and harder to trust.
