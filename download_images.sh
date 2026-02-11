#!/bin/bash
# LOTR Card Image Downloader

CHAR_DIR="/root/clawd/card_game_project/public/cards/characters"
SITE_DIR="/root/clawd/card_game_project/public/cards/sites"
LOG="/root/clawd/card_game_project/IMAGE_GEN_LOG.md"

download_image() {
    local url="$1"
    local output="$2"
    local name="$3"
    
    echo "Downloading $name..." | tee -a "$LOG"
    curl -sL -o "$output" "$url"
    
    if [ -f "$output" ]; then
        size=$(stat -c%s "$output")
        filetype=$(file -b "$output")
        if [ "$size" -gt 10000 ] && [[ "$filetype" == *"JPEG"* || "$filetype" == *"image"* ]]; then
            echo "✓ $name - ${size} bytes - $filetype" | tee -a "$LOG"
            return 0
        else
            echo "✗ $name failed validation (size: $size, type: $filetype)" | tee -a "$LOG"
            rm -f "$output"
            return 1
        fi
    else
        echo "✗ $name download failed" | tee -a "$LOG"
        return 1
    fi
}

# Characters (skip ones we already have)
declare -A CHARS=(
    ["gimli"]="fantasy%20portrait%20dwarf%20warrior%20with%20thick%20red%20beard%20iron%20helmet%20battle%20axe%20digital%20art%20card%20game%20art%20style%20dramatic%20lighting"
    ["gandalf"]="fantasy%20portrait%20elderly%20wizard%20with%20long%20grey%20beard%20and%20pointed%20grey%20hat%20wooden%20staff%20wise%20eyes%20digital%20art%20card%20game%20art%20style"
    ["nazgul"]="fantasy%20portrait%20dark%20hooded%20wraith%20black%20robes%20shadowy%20face%20with%20glowing%20eyes%20menacing%20digital%20art%20card%20game%20art%20style"
    ["uruk-hai"]="fantasy%20portrait%20muscular%20orc%20warrior%20with%20dark%20skin%20white%20hand%20mark%20on%20face%20heavy%20armor%20digital%20art%20card%20game%20art%20style"
    ["cave-troll"]="fantasy%20portrait%20massive%20grey%20cave%20troll%20small%20eyes%20chains%20dark%20cave%20background%20digital%20art%20card%20game%20art%20style"
    ["saruman"]="fantasy%20portrait%20white%20robed%20wizard%20with%20long%20white%20hair%20and%20beard%20crystal%20staff%20digital%20art%20card%20game%20art%20style"
    ["boromir"]="fantasy%20portrait%20noble%20warrior%20of%20Gondor%20brown%20hair%20chainmail%20sword%20and%20shield%20digital%20art%20card%20game%20art%20style"
)

# Sites
declare -A SITES=(
    ["bag-end"]="hobbit%20hole%20with%20round%20green%20door%20flowers%20peaceful%20Shire%20fantasy%20landscape%20digital%20art"
    ["rivendell"]="elven%20valley%20with%20waterfalls%20elegant%20architecture%20autumn%20trees%20fantasy%20landscape%20digital%20art"
    ["weathertop"]="ruined%20stone%20tower%20on%20hilltop%20stormy%20sky%20ancient%20ruins%20fantasy%20landscape%20digital%20art"
    ["moria-gate"]="massive%20dwarf%20doors%20in%20mountainside%20ancient%20stone%20carvings%20dark%20entrance%20fantasy%20digital%20art"
    ["lothlorien"]="golden%20forest%20with%20massive%20trees%20ethereal%20light%20filtering%20through%20fantasy%20landscape%20digital%20art"
    ["mount-doom"]="volcanic%20mountain%20with%20lava%20dark%20sky%20Mordor%20fire%20and%20ash%20fantasy%20landscape%20digital%20art"
)

echo "" >> "$LOG"
echo "## Batch Download $(date)" >> "$LOG"
echo "" >> "$LOG"

# Download remaining characters
for name in "${!CHARS[@]}"; do
    if [ ! -f "$CHAR_DIR/$name.jpg" ]; then
        url="https://image.pollinations.ai/prompt/${CHARS[$name]}?width=300&height=420&nologo=true"
        download_image "$url" "$CHAR_DIR/$name.jpg" "$name"
        sleep 5
    else
        echo "Skipping $name - already exists" | tee -a "$LOG"
    fi
done

# Download sites
for name in "${!SITES[@]}"; do
    if [ ! -f "$SITE_DIR/$name.jpg" ]; then
        url="https://image.pollinations.ai/prompt/${SITES[$name]}?width=420&height=300&nologo=true"
        download_image "$url" "$SITE_DIR/$name.jpg" "$name"
        sleep 5
    else
        echo "Skipping $name - already exists" | tee -a "$LOG"
    fi
done

echo "" >> "$LOG"
echo "## Final Status" >> "$LOG"
echo "Characters:" >> "$LOG"
ls -la "$CHAR_DIR"/*.jpg 2>/dev/null | tee -a "$LOG"
echo "" >> "$LOG"
echo "Sites:" >> "$LOG"
ls -la "$SITE_DIR"/*.jpg 2>/dev/null | tee -a "$LOG"
echo "" >> "$LOG"
echo "DONE at $(date)" >> "$LOG"
