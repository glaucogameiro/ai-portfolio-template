# Living Circuit — AI Portfolio Template

A reusable static portfolio template contributed by Glauco Guedes. Built with HTML, CSS and JavaScript, with five navigation sections, a smooth code-inspired transition, search, accessible dialogs, and a content catalogue.

**All profile, project and credential content is fictional.** This template contains no personal résumé, certificate, client record, unreleased product material or supplied photographic/video assets.

## Start locally

~~~text
python -m http.server 8080 --bind 127.0.0.1
~~~

Open http://127.0.0.1:8080/ in your browser. Serve the folder through HTTP; do not open index.html directly, because content.json is fetched separately. No database or build step is required.

## Customize

1. Edit content.json for your profile, experience, education, skills, projects, learning records and public links.
2. Keep record IDs stable when updating existing items.
3. Replace the sample SVGs with materials you own or have permission to publish. Mark diagrams, prototypes and real screenshots accurately.
4. Update the name, document titles, header, footer and description in index.html and app.js.
5. Replace the example contact links. The default guide link can be changed to your own public résumé after adapting the link labels.
6. Publish only the files intended for visitors. Never include credentials, private documents or confidential product plans.

Projects and credentials are maintained as data. Add a record rather than copying page markup. Image arrays can be empty; the interface supports records without images.

## Media and motion

The included artwork is newly authored SVG. The default portal opens without a video. You may add your own introduction source to the existing video element; its end event releases the navigation. Do not redistribute third-party media without appropriate rights.

The template respects reduced motion and offers background pause, keyboard navigation, dialog close controls and image navigation.

## License and contributions

MIT License applies to the source code and included original SVG examples. You may use and adapt them, including commercially, while retaining the license and copyright notice. Your own added identity, certificates, trademarks, text and media require their own permissions.

Issues and pull requests with focused improvements, accessibility fixes and documentation are welcome. Do not include personal data or credentials in examples or reports.

Created by [Glauco Guedes](https://github.com/glaucogameiro).
