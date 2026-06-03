const CHANNEL_URL = 'https://www.youtube.com/@donghanglottery/streams';

export type LottoVideo = {
  round: number;
  videoId: string;
  title: string;
};

export async function fetchLottoVideos(): Promise<LottoVideo[]> {
  const res = await fetch(CHANNEL_URL, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      'Accept-Language': 'ko-KR,ko;q=0.9',
    },
  });

  if (!res.ok) {
    throw new Error(`YouTube fetch failed: ${res.status}`);
  }

  const html = await res.text();

  const titlePattern = /"content":"(로또6\/45 제(\d+)회 당첨번호[^"]*)"/g;
  const videoIdPattern = /"videoId":"([^"]+)"/g;

  const allVideoIds: { index: number; id: string }[] = [];
  let match: RegExpExecArray | null;
  while ((match = videoIdPattern.exec(html)) !== null) {
    allVideoIds.push({ index: match.index, id: match[1]! });
  }

  const results: LottoVideo[] = [];
  const seen = new Set<number>();

  while ((match = titlePattern.exec(html)) !== null) {
    const title = match[1]!;
    const round = parseInt(match[2]!, 10);
    if (seen.has(round)) continue;
    seen.add(round);

    const titleIndex = match.index;
    let closestVid = '';
    let closestDist = Infinity;
    for (const v of allVideoIds) {
      const dist = titleIndex - v.index;
      if (dist > 0 && dist < closestDist) {
        closestDist = dist;
        closestVid = v.id;
      }
    }

    if (closestVid) {
      results.push({ round, videoId: closestVid, title });
    }
  }

  return results;
}

export async function fetchVideoForRound(targetRound: number): Promise<string | null> {
  const videos = await fetchLottoVideos();
  const found = videos.find((v) => v.round === targetRound);
  return found?.videoId ?? null;
}
