# Tagwerk installieren und aktualisieren

Tagwerk ist eine Web-App, die nach der Installation offline läuft. Sie braucht eine Adresse im Internet, von der das Handy sie einmal lädt. Dafür eignet sich GitHub Pages, kostenlos und ohne Werbung.

> **Dein Fortschritt liegt nur auf deinem Handy**, im Speicher der installierten App. Behalte die Adresse bei, sichere regelmäßig unter **Einstellungen (Zahnrad) → Backup exportieren**, und mach vor jeder Umstellung ein Backup.

## Weg A: fertige Dateien hochladen (einfach, auch am Handy)

Du brauchst nur die sechs Dateien aus `tagwerk-offline.zip` oder aus dem Ordner `dist/` nach `npm run build`.

1. ZIP entpacken. Auf Android: in „Dateien“ (Files by Google) auf die ZIP tippen, dann „Entpacken“.
2. Auf github.com ein kostenloses Konto anlegen und anmelden.
3. Oben rechts „+“ → „New repository“. Name: `tagwerk`, „Public“, „Create repository“.
4. Auf der leeren Seite „uploading an existing file“ antippen. Alle sechs Dateien auswählen: `index.html`, `manifest.webmanifest`, `sw.js`, `icon-192.png`, `icon-512.png`, `icon-maskable-512.png`. Unten „Commit changes“.
5. „Settings“ → links „Pages“ → unter „Branch“ `main` und `/(root)` wählen → „Save“.
6. 1 bis 2 Minuten warten, Seite neu laden. Oben steht der Link, etwa `https://DEIN-NAME.github.io/tagwerk/`.
7. Den Link auf dem Handy öffnen. Chrome: Menü ⋮ → „App installieren“. Firefox: Menü ⋮ → „Zum Startbildschirm hinzufügen“ bzw. „Installieren“.
8. Die App einmal mit Internet öffnen. Danach geht sie offline.

Fehlen auf dem Handy Knöpfe bei GitHub: im Browser-Menü ⋮ „Desktopwebsite“ anhaken.

**Update:** Im Repository „Add file“ → „Upload files“, die neuen Dateien auswählen, „Commit changes“. Die alten werden ersetzt. Nach 1 bis 2 Minuten die App mit Internet öffnen. Erscheint „Eine neue Version ist da“, auf „Neu laden“ tippen. Die Cache-Version im Service Worker setzt der Build automatisch, du musst nichts von Hand ändern. Der Fortschritt bleibt, solange der Link gleich bleibt: Er gehört zur Adresse, nicht zu den Dateien.

**Neues Symbol:** Android übernimmt ein geändertes Symbol nicht in eine schon installierte App. Backup exportieren, das alte Symbol vom Startbildschirm entfernen, den Link **im selben Browser** öffnen und neu installieren. Der Fortschritt hängt an der Adresse und am Browser, nicht am Symbol. Firefox und Firefox Beta sind getrennte Browser mit getrenntem Speicher: Wer die App in Firefox Beta hatte und in Firefox neu installiert, startet dort leer, der alte Stand liegt weiter in Firefox Beta.

## Weg B: ganzes Repository mit automatischer Veröffentlichung

Hier liegt der Quellcode im Repository, und GitHub baut, testet und veröffentlicht die App bei jeder Änderung selbst (`.github/workflows/pages.yml`). Das geht am besten an einem Computer.

**Achtung beim Umstieg von Weg A im selben Repository:** Sobald der Quellcode statt der fertigen Dateien im Hauptordner liegt, findet GitHub Pages keine `index.html` mehr und die App ist nicht erreichbar, bis Schritt 3 erledigt ist. Die Adresse bleibt gleich, solange das Repository `tagwerk` heißt.

1. Backup in der App exportieren.
2. Den Inhalt dieses Repositorys hochladen (am Computer: Ordner in „Upload files“ ziehen, oder mit `git push`). Die alten fünf Dateien im Hauptordner löschen.
3. „Settings“ → „Pages“ → „Source“: **GitHub Actions** wählen.
4. Unter „Actions“ läuft „Pages“ an. Nach etwa einer Minute ist die App unter derselben Adresse wieder da.
5. App mit Internet öffnen, „Neu laden“ tippen, prüfen, dass der Fortschritt da ist.

Wer es ganz risikofrei will, legt für den Quellcode ein zweites Repository an (etwa `tagwerk-quellcode`) und spielt Updates weiter nach Weg A ein.

## Weg C: Repository vom Handy aus mit Termux (empfohlen, wenn Termux installiert ist)

Wie Weg B, aber ohne Computer. Danach liegt der Quellcode dauerhaft auf GitHub, und ein Update ist eine einzige Datei (`tagwerk-….patch`) plus ein Befehl. Termux aus F-Droid oder GitHub verwenden; die alte Fassung aus dem Play Store hat oft kaputte Paketquellen.

**Einmalig einrichten**

1. In der App: Backup exportieren.
2. Auf GitHub im Repository: „Settings“ → „Pages“ → „Source“: **GitHub Actions**. Die bisherige Seite bleibt bis zur ersten neuen Veröffentlichung erreichbar; die installierte App läuft ohnehin aus ihrem Zwischenspeicher.
3. `tagwerk-repo.zip` herunterladen (landet in „Downloads“).
4. In Termux, `DEIN-NAME` ersetzen:

```sh
pkg update -y && pkg install -y git gh unzip
termux-setup-storage
gh auth login -h github.com -p https -s workflow -w
gh auth setup-git
git config --global user.name "DEIN-NAME"
git config --global user.email "DEIN-NAME@users.noreply.github.com"
cd ~ && gh repo clone DEIN-NAME/tagwerk && cd tagwerk
git rm -q --ignore-unmatch index.html manifest.webmanifest sw.js icon-192.png icon-512.png icon-maskable-512.png README.txt
Z=$(ls -t ~/storage/downloads/tagwerk-repo*.zip | head -1)
unzip -q -o "$Z" -d ~/twz && cp -r ~/twz/tagwerk/. . && rm -rf ~/twz
git add -A && git commit -q -m "Quellcode" && git push
echo "alias tagwerk='sh ~/tagwerk/tools/einspielen.sh'" >> ~/.bashrc
```

`termux-setup-storage` fragt nach Zugriff auf Dateien: erlauben. `gh auth login` zeigt einen Code und eine Adresse (github.com/login/device): im Browser öffnen, Code eingeben, bestätigen. `-s workflow` ist nötig, weil das Repository Workflow-Dateien enthält; ohne diese Berechtigung lehnt GitHub den Push ab.

5. Unter „Actions“ läuft „Pages“ an (1 bis 2 Minuten). Danach die App mit Internet öffnen, „Neu laden“ tippen. Adresse und Fortschritt bleiben gleich.

**Jedes weitere Update**

`tagwerk-….patch` herunterladen, Termux öffnen, `tagwerk` eintippen. Das Skript `tools/einspielen.sh` spielt die neueste Datei aus „Downloads“ ein, veröffentlicht und legt sie danach in `Downloads/tagwerk-eingespielt/` ab. Passt ein Update nicht zum Stand auf GitHub, ändert es nichts und sagt das.

Für Claude: Ist das Repository öffentlich, reicht der Link (`https://github.com/DEIN-NAME/tagwerk`), um den aktuellen Stand zu holen; ein ZIP ist dann nicht mehr nötig.

## Was nur in der installierten App geht

Teilen an Tagwerk (Share-Ziel), Schnellzugriffe am App-Symbol, Spracherkennung und dauerhafte Speicherung funktionieren nur in Chrome bzw. in der installierten App. In der Vorschau der Claude-App fehlen sie, und der Fortschritt geht dort beim Schließen verloren.

## Firefox für Android

Alles Übrige läuft, auch offline. Firefox bietet nach heutigem Stand keine Spracherkennung (also kein „Aussprache prüfen“), kein Teilen an die App und keine Schnellzugriffe am Symbol. Der Lernstand liegt im Speicher von Firefox: In den Firefox-Einstellungen darf „Browserdaten beim Beenden löschen“ nicht eingeschaltet sein, und „Websitedaten löschen“ für die Adresse löscht auch den Fortschritt.
