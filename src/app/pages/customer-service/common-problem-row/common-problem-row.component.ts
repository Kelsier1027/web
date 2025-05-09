import { Component, OnInit } from '@angular/core';
import { ResponseCode } from 'src/app/enums';
import { AuthService } from 'src/app/auth/services/auth.service';
import { EnvConfig } from 'src/app/app.module';

@Component({
  selector: 'app-common-problem-row',
  templateUrl: './common-problem-row.component.html',
  styleUrls: ['./common-problem-row.component.scss'],
})
export class CommonProblemRowComponent implements OnInit {
  accountlist = [
    {
      title: '如何新增帳號？',
      content: '內容',
      isContentVisible: false,
    },
    {
      title: '各種帳號身份，可使用的功能有什麼不一樣？',
      content: '內容',
      isContentVisible: false,
    },
    {
      title: '如何新增送貨及帳單地址？',
      content: '內容',
      isContentVisible: false,
    },
    {
      title: '如何設定常用的送貨地址、收貨人？',
      content: '內容',
      isContentVisible: false,
    },
    {
      title: '如何變更密碼？',
      content: '內容',
      isContentVisible: false,
    },
    {
      title: '忘記密碼該如何處理？',
      content: '內容',
      isContentVisible: false,
    },
  ];

  billinglist = [
    {
      title: '如何付款？',
      content: '內容',
      isContentVisible: false,
    },
    {
      title: '沒有額度該如何處裡',
      content: '內容',
      isContentVisible: false,
    },
  ];

  ordingList = [
    {
      title: '如何付要採購的商品找不到或庫存不足該怎麼辦？',
      content: '內容',
      isContentVisible: false,
    },
    {
      title:
        '需要的商品只有組合價或是量購價，但不想要組合價或是只有單台或低於量購的數量需求時怎麼辦？',
      content: '內容',
      isContentVisible: false,
    },
    {
      title: '如何查詢訂單？',
      content: '內容',
      isContentVisible: false,
    },
    {
      title: '如何查詢商品序號？',
      content: '內容',
      isContentVisible: false,
    },
    {
      title: '下單之後，未收到貨之前是否可以取消訂單？',
      content: '內容',
      isContentVisible: false,
    },
    {
      title: '如何辦理銷退？',
      content: '內容',
      isContentVisible: false,
    },
    {
      title: '收到的商品品質有瑕疵，或短缺該如何處理？',
      content: '內容',
      isContentVisible: false,
    },
  ];

  list = [
    {
      questionType: '帳戶問題',
      questionList: this.accountlist,
    },
    {
      questionType: '付款問題',
      questionList: this.billinglist,
    },
    {
      questionType: '訂單問題',
      questionList: this.ordingList,
    },
  ];

  constructor(private authService: AuthService, private envConfig: EnvConfig) {}

  ngOnInit(): void { 
    this.authService.getFaq(this.envConfig.orgId).subscribe((resp: any) => {
      // Assuming resp.responseCode === ResponseCode.Success before proceeding
  
      // 創建一個空的物件以存儲基於問題類型的問題列表
      const questionLists: { [questionType: string]: any[] } = {};
  
      // 循環處理JSON數據中的類型和項目
      for (const type of resp.result.types) {
        const questionType = type.name; // 獲取問題類型
  
        // 如果問題類型對應的問題列表不存在，則進行初始化
        if (!questionLists[questionType]) {
          questionLists[questionType] = [];
        }
  
        for (const item of type.items) {
          const question = item.question;
          const answer = item.answer;
  
          // 基於問題和答案創建對象
          const questionObject = {
            title: question,
            content: answer,
            isContentVisible: false, // 您可以根據需要設置此值
          };
  
          // 根據問題類型將對象添加到相應的列表中
          questionLists[questionType].push(questionObject);
        }
      }
  
      // 基於動態生成的問題列表創建最終列表
      const finalList = Object.keys(questionLists).map((questionType) => ({
        questionType,
        questionList: questionLists[questionType],
      }));
  
      // 現在，您可以在finalList變數中找到映射後的數據
      this.list = finalList;
    });
  }
  

  toggleContent(item: any): void {
    item.isContentVisible = !item.isContentVisible;
  }

  isSales(): boolean {
    return JSON.parse(localStorage.getItem('isSales') ?? 'true');
  }
}
