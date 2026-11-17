# GLOSAR — recording guide

**English** · [Română](recording-guide.ro.md)

A recording lets learners hear the word. One word, one short file. You need a phone or a computer with a microphone, and a browser.

## What the project accepts

- **Opus audio**, in an **Ogg** (`.opus` or `.ogg`) or **WebM** (`.webm`) container;
- **at most 50 KB** per word (the page records at 24 kbit/s and stops by itself after 8 seconds; a full 8 seconds comes to about 20–30 KB);
- one word or one short phrase per file; the file is named after the entry (`audio/ruq-tinti.opus`), the import script does that for you.

Other formats (MP3, WAV, M4A, Vorbis in Ogg) are refused by the page and by `scripts/validate.py`.

## Record on the page

1. Open the **Add** tab and fill in the word (the recording belongs to the entry you are writing).
2. Under **Audio recording**, press **Record**. The browser asks for the microphone: allow it.
3. Say the word once, calmly, as you would say it to a friend. Leave about half a second of silence before and after.
4. Press **Stop** (or wait: it stops by itself). The page shows the size (“Recording ready: 22 KB”) and a **Listen** button; listen to it.
5. Not good? Press **Remove the recording** and record again.
6. Press **Check**, then **Add to my list**. The recording is saved in the browser with the entry and goes into the contribution file.

**Which browsers record Opus?** Chrome, Edge and Firefox (computer and Android). **Safari (iPhone, iPad, Mac) cannot record Opus**: there, use another browser, or upload a file made with another app (below).

## Tips for a good recording

- A quiet room, doors closed, no fan or running water; a wardrobe or a bed with a blanket makes a good little studio.
- The microphone about a hand’s width from the mouth, slightly to the side so that “p” and “t” do not pop. A headset microphone works well.
- One word, spoken naturally. Do not read it like a list and do not shout. If the word has dialect variants, record the one the entry is about and write the dialect in the entry.
- Check that the phone is not in a power-saving mode that mutes the microphone.
- Record only yourself, or people who agreed to be recorded and to publish their voice under the project licence.

## Upload a file made with another app

If you already have a recording, or you use Safari, convert it to Opus and upload it under **Or upload a file**. With `ffmpeg` (free) installed:

```
ffmpeg -i word.m4a -ac 1 -c:a libopus -b:a 24k -t 8 word.opus
```

`-ac 1` makes it mono, `-b:a 24k` keeps it small, `-t 8` cuts it at 8 seconds. Check the size (under 50 KB): if it is larger, shorten the silence or lower the bitrate (`-b:a 16k`). The page tells you if the file is not Opus or is too big.

## Check a file from the command line

```
python scripts/validate.py
```

fails if an audio file listed in an entry is missing, is not Opus in Ogg or WebM, is larger than 50 KB, or is not named after its entry.

## Privacy

Nothing is sent when you record: the sound stays in your browser until you download the contribution file and send it yourself. The page does not store your voice anywhere else and has no account.
