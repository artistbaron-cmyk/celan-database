# Dictionary source history

These are the pre-migration source tables and display overlays. They were preserved when the app switched to the approved records in `../app_data/`. The current app does not load anything in this folder.

`checks/` holds the earlier tests and expression validator tied to those historical tables and the former assembly process. They are retained as evidence, not as current app tests. Run `node dictionary/app_data.test.cjs` for the active source layout.

The one-time `capture_app_sources.cjs` script records how the current app-facing files were created from the prior assembled view. It should not be rerun against the new app.
