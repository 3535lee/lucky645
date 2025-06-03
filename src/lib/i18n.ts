export type Locale = 'ko' | 'en' | 'id';

export const locales: Locale[] = ['ko', 'en', 'id'];

export const defaultLocale: Locale = 'ko';

export type Dictionary = {
  nav: {
    home: string;
    lookup: string;
    verify: string;
    recommend: string;
    contact: string;
  };
  home: {
    title: string;
    subtitle: string;
    latestRound: string;
    dataRange: string;
    features: {
      lookup: {
        title: string;
        description: string;
      };
      verify: {
        title: string;
        description: string;
      };
      recommend: {
        title: string;
        description: string;
      };
      contact: {
        title: string;
        description: string;
      };
    };
    ballColors: string;
  };
  lookup: {
    title: string;
    subtitle: string;
    loading: string;
    error: string;
    retry: string;
    previous: string;
    next: string;
    totalData: string;
  };
  verify: {
    title: string;
    subtitle: string;
    inputLabel: string;
    verify: string;
    verifying: string;
    clear: string;
    notWon: string;
    notWonDesc: string;
    alreadyWon: string;
    errors: {
      incomplete: string;
      invalidRange: string;
      duplicate: string;
    };
  };
  recommend: {
    title: string;
    subtitle: string;
    generate: string;
    generating: string;
    newGenerate: string;
    copy: string;
    copied: string;
    warning: string;
    warnings: string[];
    disclaimer: string;
    disclaimers: string[];
  };
  contact: {
    title: string;
    subtitle: string;
    name: string;
    account: string;
    message: string;
    send: string;
    sending: string;
    success: string;
    successDesc: string;
    error: string;
  };
  common: {
    round: string;
    winningNumbers: string;
    bonusNumber: string;
    first: string;
    second: string;
    third: string;
    winners: string;
    recommendation: string;
  };
};

const dictionaries: Record<Locale, Dictionary> = {
  ko: {
    nav: {
      home: '홈',
      lookup: '번호조회',
      verify: '번호검증',
      recommend: '번호추천',
      contact: '문의하기'
    },
    home: {
      title: 'Lucky645',
      subtitle: '로또 6/45 당첨번호 조회 및 추천 서비스',
      latestRound: '최신 회차',
      dataRange: '로또 데이터베이스에 1회부터 {round}회까지 수록',
      features: {
        lookup: {
          title: '번호조회',
          description: '1회부터 최신회까지 모든 당첨번호를 조회하세요'
        },
        verify: {
          title: '번호검증',
          description: '선택한 6개 번호가 1등에 당첨된 적이 있는지 확인'
        },
        recommend: {
          title: '번호추천',
          description: '1등에 당첨된 적이 없는 번호 조합을 추천'
        },
        contact: {
          title: '문의하기',
          description: '텔레그램으로 문의사항을 보내세요'
        }
      },
      ballColors: '로또 6/45 번호별 색상'
    },
    lookup: {
      title: '로또 6/45 당첨번호 조회',
      subtitle: '1회부터 최신회까지 모든 당첨번호를 확인하세요',
      loading: '로딩중...',
      error: '오류 발생',
      retry: '다시 시도',
      previous: '이전',
      next: '다음',
      totalData: '총 {count}개의 회차 데이터'
    },
    verify: {
      title: '번호 검증',
      subtitle: '6개 번호가 1등에 당첨된 적이 있는지 확인하세요',
      inputLabel: '로또 번호 6개를 입력하세요 (1-45)',
      verify: '번호 검증',
      verifying: '검증 중...',
      clear: '초기화',
      notWon: '당첨된 적이 없는 번호입니다!',
      notWonDesc: '이 번호 조합은 아직 1등에 당첨된 적이 없습니다.',
      alreadyWon: '이미 당첨된 번호입니다! ({count}회)',
      errors: {
        incomplete: '6개의 번호를 모두 입력해주세요.',
        invalidRange: '번호는 1부터 45까지만 입력 가능합니다.',
        duplicate: '중복된 번호는 입력할 수 없습니다.'
      }
    },
    recommend: {
      title: '번호 추천',
      subtitle: '1등에 당첨된 적이 없는 번호 조합을 추천해드립니다',
      generate: '추천 번호 생성',
      generating: '생성 중...',
      newGenerate: '새로운 번호 생성',
      copy: '복사',
      copied: '번호가 클립보드에 복사되었습니다!',
      warning: '⚠️ 주의사항',
      warnings: [
        '※ 생성되는 번호는 과거 1등에 당첨된 적이 없는 조합입니다',
        '※ 미래의 당첨을 보장하지는 않습니다'
      ],
      disclaimer: '주의사항',
      disclaimers: [
        '추천 번호는 과거 당첨 데이터를 바탕으로 한 참고용입니다',
        '로또는 완전한 확률 게임으로 미래 당첨을 예측할 수 없습니다',
        '과도한 구매는 자제하시고 적정선에서 즐기시기 바랍니다',
        '모든 번호 조합의 당첨 확률은 동일합니다'
      ]
    },
    contact: {
      title: '문의하기',
      subtitle: '궁금한 점이나 요청사항을 텔레그램으로 보내주세요',
      name: '이름',
      account: 'WhatsApp/Telegram 계정',
      message: '문의/구매 요청',
      send: '전송',
      sending: '전송 중...',
      success: '전송 완료!',
      successDesc: '메시지가 성공적으로 전송되었습니다.',
      error: '전송에 실패했습니다. 다시 시도해주세요.'
    },
    common: {
      round: '제{round}회',
      winningNumbers: '당첨번호',
      bonusNumber: '보너스',
      first: '1등',
      second: '2등',
      third: '3등',
      winners: '{count}명',
      recommendation: '추천 {index}'
    }
  },
  en: {
    nav: {
      home: 'Home',
      lookup: 'Lookup',
      verify: 'Verify',
      recommend: 'Recommend',
      contact: 'Contact'
    },
    home: {
      title: 'Lucky645',
      subtitle: 'Korean Lotto 6/45 winning number lookup and recommendation service',
      latestRound: 'Latest Round',
      dataRange: 'Database contains rounds 1 to {round}',
      features: {
        lookup: {
          title: 'Number Lookup',
          description: 'View all winning numbers from round 1 to latest'
        },
        verify: {
          title: 'Number Verification',
          description: 'Check if your 6 numbers have ever won 1st prize'
        },
        recommend: {
          title: 'Number Recommendation',
          description: 'Get number combinations that have never won 1st prize'
        },
        contact: {
          title: 'Contact Us',
          description: 'Send inquiries via Telegram'
        }
      },
      ballColors: 'Lotto 6/45 Number Colors'
    },
    lookup: {
      title: 'Lotto 6/45 Winning Numbers',
      subtitle: 'View all winning numbers from round 1 to latest',
      loading: 'Loading...',
      error: 'Error Occurred',
      retry: 'Retry',
      previous: 'Previous',
      next: 'Next',
      totalData: 'Total {count} rounds of data'
    },
    verify: {
      title: 'Number Verification',
      subtitle: 'Check if your 6 numbers have ever won 1st prize',
      inputLabel: 'Enter 6 lotto numbers (1-45)',
      verify: 'Verify Numbers',
      verifying: 'Verifying...',
      clear: 'Clear',
      notWon: 'Numbers never won!',
      notWonDesc: 'This number combination has never won 1st prize.',
      alreadyWon: 'These numbers already won! ({count} times)',
      errors: {
        incomplete: 'Please enter all 6 numbers.',
        invalidRange: 'Numbers must be between 1 and 45.',
        duplicate: 'Duplicate numbers are not allowed.'
      }
    },
    recommend: {
      title: 'Number Recommendation',
      subtitle: 'Get number combinations that have never won 1st prize',
      generate: 'Generate Recommendations',
      generating: 'Generating...',
      newGenerate: 'Generate New Numbers',
      copy: 'Copy',
      copied: 'Numbers copied to clipboard!',
      warning: '⚠️ Warning',
      warnings: [
        '※ Generated numbers are combinations that have never won 1st prize',
        '※ This does not guarantee future winnings'
      ],
      disclaimer: 'Disclaimer',
      disclaimers: [
        'Recommended numbers are for reference based on historical data',
        'Lotto is a game of chance and future winnings cannot be predicted',
        'Please play responsibly and within your means',
        'All number combinations have equal probability of winning'
      ]
    },
    contact: {
      title: 'Contact Us',
      subtitle: 'Send your questions or requests via Telegram',
      name: 'Name',
      account: 'WhatsApp/Telegram Account',
      message: 'Inquiry/Purchase Request',
      send: 'Send',
      sending: 'Sending...',
      success: 'Sent Successfully!',
      successDesc: 'Your message has been sent successfully.',
      error: 'Failed to send. Please try again.'
    },
    common: {
      round: 'Round {round}',
      winningNumbers: 'Winning Numbers',
      bonusNumber: 'Bonus',
      first: '1st Prize',
      second: '2nd Prize',
      third: '3rd Prize',
      winners: '{count} winners',
      recommendation: 'Recommendation {index}'
    }
  },
  id: {
    nav: {
      home: 'Beranda',
      lookup: 'Pencarian',
      verify: 'Verifikasi',
      recommend: 'Rekomendasi',
      contact: 'Kontak'
    },
    home: {
      title: 'Lucky645',
      subtitle: 'Layanan pencarian dan rekomendasi nomor pemenang Lotto Korea 6/45',
      latestRound: 'Putaran Terbaru',
      dataRange: 'Database berisi putaran 1 hingga {round}',
      features: {
        lookup: {
          title: 'Pencarian Nomor',
          description: 'Lihat semua nomor pemenang dari putaran 1 hingga terbaru'
        },
        verify: {
          title: 'Verifikasi Nomor',
          description: 'Periksa apakah 6 nomor Anda pernah memenangkan hadiah utama'
        },
        recommend: {
          title: 'Rekomendasi Nomor',
          description: 'Dapatkan kombinasi nomor yang belum pernah menang hadiah utama'
        },
        contact: {
          title: 'Hubungi Kami',
          description: 'Kirim pertanyaan melalui Telegram'
        }
      },
      ballColors: 'Warna Nomor Lotto 6/45'
    },
    lookup: {
      title: 'Nomor Pemenang Lotto 6/45',
      subtitle: 'Lihat semua nomor pemenang dari putaran 1 hingga terbaru',
      loading: 'Memuat...',
      error: 'Terjadi Kesalahan',
      retry: 'Coba Lagi',
      previous: 'Sebelumnya',
      next: 'Selanjutnya',
      totalData: 'Total {count} putaran data'
    },
    verify: {
      title: 'Verifikasi Nomor',
      subtitle: 'Periksa apakah 6 nomor Anda pernah memenangkan hadiah utama',
      inputLabel: 'Masukkan 6 nomor lotto (1-45)',
      verify: 'Verifikasi Nomor',
      verifying: 'Memverifikasi...',
      clear: 'Hapus',
      notWon: 'Nomor belum pernah menang!',
      notWonDesc: 'Kombinasi nomor ini belum pernah memenangkan hadiah utama.',
      alreadyWon: 'Nomor ini sudah pernah menang! ({count} kali)',
      errors: {
        incomplete: 'Harap masukkan semua 6 nomor.',
        invalidRange: 'Nomor harus antara 1 dan 45.',
        duplicate: 'Nomor duplikat tidak diperbolehkan.'
      }
    },
    recommend: {
      title: 'Rekomendasi Nomor',
      subtitle: 'Dapatkan kombinasi nomor yang belum pernah menang hadiah utama',
      generate: 'Buat Rekomendasi',
      generating: 'Membuat...',
      newGenerate: 'Buat Nomor Baru',
      copy: 'Salin',
      copied: 'Nomor disalin ke clipboard!',
      warning: '⚠️ Peringatan',
      warnings: [
        '※ Nomor yang dihasilkan adalah kombinasi yang belum pernah menang hadiah utama',
        '※ Ini tidak menjamin kemenangan di masa depan'
      ],
      disclaimer: 'Penyangkalan',
      disclaimers: [
        'Nomor yang direkomendasikan hanya untuk referensi berdasarkan data historis',
        'Lotto adalah permainan peluang dan kemenangan masa depan tidak dapat diprediksi',
        'Harap bermain secara bertanggung jawab dan sesuai kemampuan',
        'Semua kombinasi nomor memiliki peluang menang yang sama'
      ]
    },
    contact: {
      title: 'Hubungi Kami',
      subtitle: 'Kirim pertanyaan atau permintaan Anda melalui Telegram',
      name: 'Nama',
      account: 'Akun WhatsApp/Telegram',
      message: 'Pertanyaan/Permintaan Pembelian',
      send: 'Kirim',
      sending: 'Mengirim...',
      success: 'Berhasil Dikirim!',
      successDesc: 'Pesan Anda telah berhasil dikirim.',
      error: 'Gagal mengirim. Silakan coba lagi.'
    },
    common: {
      round: 'Putaran {round}',
      winningNumbers: 'Nomor Pemenang',
      bonusNumber: 'Bonus',
      first: 'Hadiah Utama',
      second: 'Hadiah Kedua',
      third: 'Hadiah Ketiga',
      winners: '{count} pemenang',
      recommendation: 'Rekomendasi {index}'
    }
  }
};

export function getDictionary(locale: Locale): Dictionary {
  return dictionaries[locale] || dictionaries[defaultLocale];
}