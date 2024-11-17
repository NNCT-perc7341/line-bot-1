import { Client, TemplateMessage, FlexMessage } from "@line/bot-sdk";

// ボタンテンプレートメッセージ（例）
export const sendButtonTemplate = async (client: Client, replyToken: string) => {
  const message: TemplateMessage = {
    type: "template",
    altText: "これはボタンテンプレートのメッセージです",
    template: {
      type: "buttons",
      title: "メニュー",
      text: "メニューから選択してください",
      actions: [
        { type: "message", label: "選択肢1", text: "選択肢1が選ばれました" },
        { type: "message", label: "選択肢2", text: "選択肢2が選ばれました" },
        { type: "message", label: "選択肢3", text: "選択肢3が選ばれました" },
      ]
    }
  };
  await client.replyMessage(replyToken, message);
};

// 確認テンプレートメッセージ（例）
export const sendConfirmTemplate = async (client: Client, replyToken: string) => {
  const message: TemplateMessage = {
    type: "template",
    altText: "これは確認テンプレートのメッセージです",
    template: {
      type: "confirm",
      text: "この操作を行いますか？",
      actions: [
        { type: "message", label: "はい", text: "はい" },
        { type: "message", label: "いいえ", text: "いいえ" }
      ]
    }
  };
  await client.replyMessage(replyToken, message);
};

// カルーセルテンプレートメッセージ（例）
export const sendCarouselTemplate = async (client: Client, replyToken: string) => {
  const message: TemplateMessage = {
    type: "template",
    altText: "これはカルーセルテンプレートのメッセージです",
    template: {
      type: "carousel",
      columns: [
        {
          thumbnailImageUrl: "https://cdn.shopify.com/s/files/1/0555/7816/5537/files/antigravity-s_1024x1024.png",
          imageBackgroundColor: "#E6DC61",
          title: "antigravity",
          text: "こんなビールです。",
          actions: [
            { type: "message", label: "購入", text: "購入したい！" },
            { type: "uri", label: "詳細", uri: "https://t0ki.beer/blogs/product/antigravity" }
          ]
        },
        {
          thumbnailImageUrl: "https://cdn.shopify.com/s/files/1/0555/7816/5537/files/minitel-s_1024x1024.png",
          imageBackgroundColor: "#EB9176",
          title: "Minitel",
          text: "こんなビールです",
          actions: [
            { type: "message", label: "購入", text: "購入したい！" },
            { type: "uri", label: "詳細", uri: "https://t0ki.beer/blogs/product/minitel" }
          ]
        }
      ]
    }
  };
  await client.replyMessage(replyToken, message);
};

// 画像カルーセルテンプレートメッセージ
export const sendImageCarouselTemplate = async (client: Client, replyToken: string) => {
  const message: TemplateMessage = {
    type: "template",
    altText: "これは画像カルーセルテンプレートのメッセージです",
    template: {
      type: "image_carousel",
      columns: [
        {
          imageUrl: "https://cdn.shopify.com/s/files/1/0555/7816/5537/files/IMG_0667_1024x1024.jpg",
          action: { type: "uri", label: "詳細", uri: "https://t0ki.beer/blogs/product/np" }
        },
        {
          imageUrl: "https://cdn.shopify.com/s/files/1/0555/7816/5537/files/vga-s_1024x1024.png",
          action: { type: "uri", label: "詳細", uri: "https://t0ki.beer/blogs/product/vga" }
        }
      ]
    }
  };
  await client.replyMessage(replyToken, message);
};

// ログインフォーム
export const sendLoginForm = async (client: Client, replyToken: string, userId: string) => {
  const loginUrl = `https://line-bot-1-1.vercel.app/login?lineId=${userId}`;
  const loginCheck = 'https://line-bot-1-1.vercel.app/login/check';

  const message: TemplateMessage = {
    type: "template",
    altText: "ログイン用のメッセージです",
    template: {
      type: "confirm",
      text: "以下のボタンを押してログインしてください",
      actions: [
        {
          type: "uri",
          label: "ログイン",
          uri: loginUrl,
        },
        {
          type: "uri",
          label: "内容確認",
          uri: loginCheck,
        }
      ]
    }
  };

  await client.replyMessage(replyToken, message);
};

export const lineProductCarousel = async (client: Client, replyToken: string) => {
  const Message: FlexMessage = {
    type: "flex",
    altText: "Line Product Carousel",
    contents: {
      "type": "carousel",
      "contents": [
        {
          "type": "bubble",
          "hero": {
            "type": "image",
            "url": "https://kirinzan.co.jp/wp-content/themes/kirinzan2021/images/lineup/chokara_hiki.jpg",
            "size": "full",
            "aspectMode": "cover"
          },
          "body": {
            "type": "box",
            "layout": "vertical",
            "contents": [
              {
                "type": "box",
                "layout": "baseline",
                "contents": [
                  {
                    "type": "text",
                    "text": "⭐️おすすめ",
                    "color": "#a12424"
                  }
                ]
              },
              {
                "type": "text",
                "text": "麒麟山 超辛口",
                "size": "lg",
                "color": "#000000",
                "margin": "md",
                "weight": "bold"
              },
              {
                "type": "text",
                "text": "すっきりとして、キレ抜群。心地良い旨味から徐々に辛さがふくらむ究極の淡麗酒。味わいは55℃のお燗にてさらに開花します。",
                "wrap": true,
                "color": "#64748B",
                "margin": "md",
                "size": "sm",
                "lineSpacing": "4px"
              }
            ]
          },
          "footer": {
            "type": "box",
            "layout": "vertical",
            "contents": [
              {
                "type": "separator"
              },
              {
                "type": "button",
                "action": {
                  "type": "uri",
                  "label": "商品を購入する",
                  "uri": "https://kirinzan.co.jp/lineup/chokara/"
                },
                "style": "primary"
              }
            ]
          }
        },
        {
          "type": "bubble",
          "hero": {
            "type": "image",
            "url": "https://tenryohai.co.jp/cdn/shop/products/4bb81a45eed3f7d7e0bd8b42b040590f-1.jpg?v=1664507674",
            "size": "full",
            "aspectMode": "cover"
          },
          "body": {
            "type": "box",
            "layout": "vertical",
            "contents": [
              {
                "type": "text",
                "text": "NEW!",
                "color": "#a12424"
              },
              {
                "type": "text",
                "text": "純米大吟醸 YK-35",
                "size": "lg",
                "color": "#000000",
                "margin": "md",
                "weight": "regular"
              },
              {
                "type": "text",
                "text": "天領盃酒造のフラッグシップモデルです。 華やかな香りと艶美な甘みをまとったエレガントなお酒です。",
                "wrap": true,
                "color": "#64748B",
                "margin": "md",
                "size": "sm",
                "lineSpacing": "4px"
              }
            ]
          },
          "footer": {
            "type": "box",
            "layout": "vertical",
            "contents": [
              {
                "type": "separator"
              },
              {
                "type": "button",
                "action": {
                  "type": "uri",
                  "label": "商品の詳細を見る",
                  "uri": "https://kirinzan.co.jp/lineup/chokara/"
                },
                "height": "md",
                "style": "primary"
              }
            ]
          }
        },
        {
          "type": "bubble",
          "hero": {
            "type": "image",
            "url": "https://cdn.shopify.com/s/files/1/0555/7816/5537/files/1d_1024x1024.png?v=1707191677",
            "size": "full"
          },
          "body": {
            "type": "box",
            "layout": "vertical",
            "contents": [
              {
                "type": "box",
                "layout": "vertical",
                "contents": [
                  {
                    "type": "text",
                    "text": "NEW!",
                    "color": "#ffffff"
                  }
                ],
                "backgroundColor": "#000000",
                "position": "absolute"
              },
              {
                "type": "text",
                "text": "Closed Beta v1.0-Ocho",
                "size": "lg",
                "margin": "xxl",
                "color": "#000000"
              },
              {
                "type": "text",
                "text": "Mosaic/Citraという黄金コンビの上に新たなホップを加えてドライでフルーティなWest Coast IPAに仕上げました！",
                "wrap": true,
                "color": "#64748B",
                "margin": "sm",
                "size": "sm"
              }
            ]
          },
          "footer": {
            "type": "box",
            "layout": "vertical",
            "contents": [
              {
                "type": "separator"
              },
              {
                "type": "button",
                "action": {
                  "type": "uri",
                  "label": "商品の詳細を見る",
                  "uri": "https://kirinzan.co.jp/lineup/chokara/"
                },
                "height": "md",
                "style": "primary"
              }
            ]
          }
        },
        {
          "type": "bubble",
          "hero": {
            "type": "image",
            "url": "https://kirinzan.co.jp/wp-content/themes/kirinzan2021/images/lineup/denkara_hiki.jpg",
            "size": "full",
            "margin": "none",
            "position": "relative",
            "aspectMode": "cover"
          },
          "body": {
            "type": "box",
            "layout": "vertical",
            "contents": [
              {
                "type": "text",
                "text": "麒麟山 伝統辛口",
                "size": "lg",
                "margin": "none",
                "color": "#000000"
              },
              {
                "type": "text",
                "text": "やっぱり、いつもの！麒麟山酒造の原点にして代表銘柄。キレの良さと飲み飽きしない味わいが人気。 （愛称「デンカラ」）",
                "wrap": true,
                "color": "#64748B",
                "margin": "sm",
                "size": "sm"
              }
            ]
          },
          "footer": {
            "type": "box",
            "layout": "vertical",
            "contents": [
              {
                "type": "separator"
              },
              {
                "type": "button",
                "action": {
                  "type": "uri",
                  "label": "商品の詳細を見る",
                  "uri": "https://kirinzan.co.jp/lineup/chokara/"
                },
                "height": "md",
                "style": "secondary"
              }
            ]
          }
        },
        {
          "type": "bubble",
          "hero": {
            "type": "image",
            "url": "https://baseec-img-mng.akamaized.net/images/item/origin/36a097e25b7ed11c38f5fea46f9688f0.jpg?imformat=generic&q=90&im=Resize,width=500,type=normal",
            "size": "full",
            "aspectMode": "cover",
            "animated": true
          },
          "body": {
            "type": "box",
            "layout": "vertical",
            "contents": [
              {
                "type": "box",
                "layout": "vertical",
                "contents": [
                  {
                    "type": "text",
                    "text": "オススメ",
                    "color": "#ffffff"
                  }
                ],
                "backgroundColor": "#000000",
                "position": "relative"
              },
              {
                "type": "text",
                "text": "Set me free 2023 / 自由にして",
                "size": "lg",
                "margin": "none",
                "color": "#000000"
              },
              {
                "type": "text",
                "text": "今年もナイアガラで造りました。 しっかりと濁っています。発酵中のタンクから直接飲むようなフレッシュジューシー。 だらりと脱力系の微炭酸・旨みたっぷりの液体になっています。",
                "wrap": true,
                "color": "#64748B",
                "margin": "sm",
                "size": "sm"
              }
            ]
          },
          "footer": {
            "type": "box",
            "layout": "vertical",
            "contents": [
              {
                "type": "separator"
              },
              {
                "type": "button",
                "action": {
                  "type": "uri",
                  "label": "商品の詳細を見る",
                  "uri": "https://kirinzan.co.jp/lineup/chokara/"
                },
                "height": "md",
                "style": "link",
                "color": "#123435"
              }
            ]
          }
        }
      ]
    }
  };
  await client.replyMessage(replyToken, Message);
}

export const lineLinkButton = async (client: Client, replyToken: string) => {
  const Message: FlexMessage = {
    type: "flex",
    altText: "Line Link Button",
    contents: {
      "type": "bubble",
      "body": {
        "type": "box",
        "layout": "vertical",
        "contents": [
          {
            "type": "text",
            "text": "他にも商品を探したい場合はこちらで確認することができます。",
            "wrap": true
          }
        ]
      },
      "footer": {
        "type": "box",
        "layout": "vertical",
        "contents": [
          {
            "type": "button",
            "action": {
              "type": "uri",
              "label": "他の商品を見る",
              "uri": "http://linecorp.com/"
            }
          }
        ]
      }
    }
  };
  await client.replyMessage(replyToken, Message);
}

export const lineOrderConfirm = async (client: Client, replyToken: string) => {
  const Message: FlexMessage = {
    type: "flex",
    altText: "Line Order Confirm",
    contents: {
      "type": "bubble",
      "body": {
        "type": "box",
        "layout": "vertical",
        "contents": [
          {
            "type": "text",
            "text": "注文確認",
            "size": "lg",
            "weight": "bold"
          },
          {
            "type": "box",
            "layout": "horizontal",
            "contents": [
              {
                "type": "text",
                "text": "注文ID",
                "color": "#64748B",
                "flex": 2,
                "size": "sm"
              },
              {
                "type": "text",
                "text": "#1234",
                "color": "#64748B",
                "flex": 5,
                "size": "sm"
              }
            ],
            "margin": "md"
          },
          {
            "type": "box",
            "layout": "horizontal",
            "contents": [
              {
                "type": "text",
                "text": "変更内容",
                "color": "#64748B",
                "flex": 2,
                "size": "sm"
              },
              {
                "type": "box",
                "layout": "vertical",
                "contents": [
                  {
                    "type": "text",
                    "text": "納品希望日を3/2から3/5に変更",
                    "color": "#64748B",
                    "wrap": true,
                    "size": "sm"
                  },
                  {
                    "type": "text",
                    "text": "お届け先を「十二屋 新潟駅前店」から「十二屋 本店」に変更",
                    "color": "#64748B",
                    "wrap": true,
                    "size": "sm",
                    "margin": "md"
                  }
                ],
                "flex": 5
              }
            ],
            "margin": "sm"
          },
          {
            "type": "separator",
            "margin": "md"
          },
          {
            "type": "box",
            "layout": "vertical",
            "contents": [
              {
                "type": "text",
                "text": "✅ 注文商品",
                "size": "sm"
              },
              {
                "type": "box",
                "layout": "horizontal",
                "contents": [
                  {
                    "type": "text",
                    "text": "Set me free 2023 / 自由にして",
                    "flex": 3,
                    "size": "lg",
                    "weight": "bold"
                  },
                  {
                    "type": "separator",
                    "margin": "sm"
                  },
                  {
                    "type": "text",
                    "text": "2ケース",
                    "flex": 1,
                    "size": "md",
                    "margin": "md",
                    "weight": "bold"
                  }
                ],
                "margin": "md"
              },
              {
                "type": "box",
                "layout": "horizontal",
                "contents": [
                  {
                    "type": "text",
                    "text": "麒麟山 伝統辛口",
                    "flex": 3,
                    "size": "lg",
                    "wrap": true,
                    "weight": "bold"
                  },
                  {
                    "type": "separator",
                    "margin": "sm"
                  },
                  {
                    "type": "text",
                    "text": "2箱",
                    "flex": 1,
                    "size": "md",
                    "margin": "md",
                    "weight": "bold"
                  }
                ],
                "margin": "md"
              },
              {
                "type": "box",
                "layout": "horizontal",
                "contents": [
                  {
                    "type": "text",
                    "text": "Closed Beta v1.0-Ocho",
                    "flex": 3,
                    "size": "lg",
                    "weight": "bold"
                  },
                  {
                    "type": "separator",
                    "margin": "sm"
                  },
                  {
                    "type": "text",
                    "text": "12缶",
                    "flex": 1,
                    "size": "md",
                    "margin": "md",
                    "weight": "bold"
                  }
                ],
                "margin": "md"
              }
            ],
            "margin": "xxl"
          },
          {
            "type": "box",
            "layout": "vertical",
            "contents": [
              {
                "type": "text",
                "text": "🗓️ 納品希望日",
                "size": "sm"
              },
              {
                "type": "text",
                "text": "2024/03/05 月曜日",
                "size": "lg",
                "weight": "bold",
                "margin": "md"
              }
            ],
            "margin": "xxl"
          },
          {
            "type": "box",
            "layout": "vertical",
            "contents": [
              {
                "type": "text",
                "text": "🚚 お届け先",
                "size": "sm"
              },
              {
                "type": "text",
                "text": "十二屋 新潟駅前店",
                "size": "lg",
                "weight": "bold",
                "margin": "md"
              }
            ],
            "margin": "xxl"
          }
        ]
      },
      "footer": {
        "type": "box",
        "layout": "vertical",
        "spacing": "sm",
        "contents": [
          {
            "type": "button",
            "style": "link",
            "height": "sm",
            "action": {
              "type": "uri",
              "label": "注文内容を確定する",
              "uri": "https://linecorp.com"
            },
            "color": "#666666"
          },
          {
            "type": "button",
            "style": "secondary",
            "height": "sm",
            "action": {
              "type": "uri",
              "label": "注文内容を変更する",
              "uri": "https://linecorp.com"
            }
          }
        ],
        "flex": 0
      }
    }
  };
  await client.replyMessage(replyToken, Message);
}

export const lineStatusMessageNormal = async (client: Client, replyToken: string) => {
  const Message: FlexMessage = {
    type: "flex",
    altText: "Line Status Message Normal",
    contents: {
      "type": "bubble",
      "body": {
        "type": "box",
        "layout": "vertical",
        "contents": [
          {
            "type": "text",
            "text": "お届け予定 2024/03/05(月)",
            "size": "lg",
            "weight": "bold",
            "wrap": true
          },
          {
            "type": "box",
            "layout": "horizontal",
            "contents": [
              {
                "type": "text",
                "text": "注文ID",
                "color": "#64748B",
                "flex": 2,
                "size": "sm"
              },
              {
                "type": "text",
                "text": "#1234",
                "color": "#64748B",
                "flex": 5,
                "size": "sm"
              }
            ],
            "margin": "md"
          },
          {
            "type": "separator",
            "margin": "md"
          },
          {
            "type": "box",
            "layout": "vertical",
            "contents": [
              {
                "type": "text",
                "text": "✅ 注文商品",
                "size": "sm"
              },
              {
                "type": "box",
                "layout": "horizontal",
                "contents": [
                  {
                    "type": "text",
                    "text": "Set me free 2023 / 自由にして",
                    "flex": 3,
                    "size": "lg",
                    "weight": "bold"
                  },
                  {
                    "type": "separator",
                    "margin": "sm"
                  },
                  {
                    "type": "text",
                    "text": "2ケース",
                    "flex": 1,
                    "size": "md",
                    "margin": "md",
                    "weight": "bold"
                  }
                ],
                "margin": "md"
              },
              {
                "type": "box",
                "layout": "horizontal",
                "contents": [
                  {
                    "type": "text",
                    "text": "麒麟山 伝統辛口",
                    "flex": 3,
                    "size": "lg",
                    "wrap": true,
                    "weight": "bold"
                  },
                  {
                    "type": "separator",
                    "margin": "sm"
                  },
                  {
                    "type": "text",
                    "text": "2箱",
                    "flex": 1,
                    "size": "md",
                    "margin": "md",
                    "weight": "bold"
                  }
                ],
                "margin": "md"
              },
              {
                "type": "box",
                "layout": "horizontal",
                "contents": [
                  {
                    "type": "text",
                    "text": "Closed Beta v1.0-Ocho",
                    "flex": 3,
                    "size": "lg",
                    "weight": "bold"
                  },
                  {
                    "type": "separator",
                    "margin": "sm"
                  },
                  {
                    "type": "text",
                    "text": "12缶",
                    "flex": 1,
                    "size": "md",
                    "margin": "md",
                    "weight": "bold"
                  }
                ],
                "margin": "md"
              }
            ],
            "margin": "xxl"
          },
          {
            "type": "box",
            "layout": "vertical",
            "contents": [
              {
                "type": "text",
                "text": "🗓️ 納品希望日",
                "size": "sm"
              },
              {
                "type": "text",
                "text": "2024/03/05 月曜日",
                "size": "lg",
                "weight": "bold",
                "margin": "md"
              }
            ],
            "margin": "xxl"
          },
          {
            "type": "box",
            "layout": "vertical",
            "contents": [
              {
                "type": "text",
                "text": "🚚 お届け先",
                "size": "sm"
              },
              {
                "type": "text",
                "text": "十二屋 新潟駅前店",
                "size": "lg",
                "weight": "bold",
                "margin": "md"
              }
            ],
            "margin": "xxl"
          }
        ]
      },
      "footer": {
        "type": "box",
        "layout": "vertical",
        "spacing": "sm",
        "contents": [
          {
            "type": "button",
            "style": "primary",
            "height": "sm",
            "action": {
              "type": "uri",
              "label": "注文内容を確認する",
              "uri": "https://linecorp.com"
            }
          }
        ],
        "flex": 0
      }
    }
  };
  await client.replyMessage(replyToken, Message);
}

export const lineStatusMessageCancel = async (client: Client, replyToken: string) => {
  const Message: FlexMessage = {
    type: "flex",
    altText: "Line Status Message Cancel",
    contents: {
      "type": "bubble",
      "body": {
        "type": "box",
        "layout": "vertical",
        "contents": [
          {
            "type": "text",
            "text": "注文をキャンセルしました",
            "size": "lg",
            "weight": "bold",
            "wrap": true,
            "color": "#E51C23"
          },
          {
            "type": "box",
            "layout": "horizontal",
            "contents": [
              {
                "type": "text",
                "text": "注文ID",
                "color": "#64748B",
                "flex": 2,
                "size": "sm"
              },
              {
                "type": "text",
                "text": "#1234",
                "color": "#64748B",
                "flex": 5,
                "size": "sm"
              }
            ],
            "margin": "md"
          },
          {
            "type": "separator",
            "margin": "md"
          },
          {
            "type": "box",
            "layout": "vertical",
            "contents": [
              {
                "type": "text",
                "text": "✅ 注文商品",
                "size": "sm"
              },
              {
                "type": "box",
                "layout": "horizontal",
                "contents": [
                  {
                    "type": "text",
                    "text": "Set me free 2023 / 自由にして",
                    "flex": 3,
                    "size": "lg",
                    "weight": "bold"
                  },
                  {
                    "type": "separator",
                    "margin": "sm"
                  },
                  {
                    "type": "text",
                    "text": "2ケース",
                    "flex": 1,
                    "size": "md",
                    "margin": "md",
                    "weight": "bold"
                  }
                ],
                "margin": "md"
              },
              {
                "type": "box",
                "layout": "horizontal",
                "contents": [
                  {
                    "type": "text",
                    "text": "麒麟山 伝統辛口",
                    "flex": 3,
                    "size": "lg",
                    "wrap": true,
                    "weight": "bold"
                  },
                  {
                    "type": "separator",
                    "margin": "sm"
                  },
                  {
                    "type": "text",
                    "text": "2箱",
                    "flex": 1,
                    "size": "md",
                    "margin": "md",
                    "weight": "bold"
                  }
                ],
                "margin": "md"
              },
              {
                "type": "box",
                "layout": "horizontal",
                "contents": [
                  {
                    "type": "text",
                    "text": "Closed Beta v1.0-Ocho",
                    "flex": 3,
                    "size": "lg",
                    "weight": "bold"
                  },
                  {
                    "type": "separator",
                    "margin": "sm"
                  },
                  {
                    "type": "text",
                    "text": "12缶",
                    "flex": 1,
                    "size": "md",
                    "margin": "md",
                    "weight": "bold"
                  }
                ],
                "margin": "md"
              }
            ],
            "margin": "xxl"
          },
          {
            "type": "box",
            "layout": "vertical",
            "contents": [
              {
                "type": "text",
                "text": "🗓️ 納品希望日",
                "size": "sm"
              },
              {
                "type": "text",
                "text": "2024/03/05 月曜日",
                "size": "lg",
                "weight": "bold",
                "margin": "md"
              }
            ],
            "margin": "xxl"
          },
          {
            "type": "box",
            "layout": "vertical",
            "contents": [
              {
                "type": "text",
                "text": "🚚 お届け先",
                "size": "sm"
              },
              {
                "type": "text",
                "text": "十二屋 新潟駅前店",
                "size": "lg",
                "weight": "bold",
                "margin": "md"
              }
            ],
            "margin": "xxl"
          }
        ]
      },
      "footer": {
        "type": "box",
        "layout": "vertical",
        "spacing": "sm",
        "contents": [
          {
            "type": "button",
            "style": "primary",
            "height": "sm",
            "action": {
              "type": "uri",
              "label": "注文内容を確認する",
              "uri": "https://linecorp.com"
            }
          }
        ],
        "flex": 0
      }
    }
  };
  await client.replyMessage(replyToken, Message);
}

/*
export const template = async (client: Client, replyToken: string) => {
  const Message: FlexMessage = {
    type: "flex",
    altText: "Line Link Button",
    contents: {
      
    }
  };
  await client.replyMessage(replyToken, Message);
}
*/