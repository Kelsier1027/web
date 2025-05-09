/** --------------------------------------------------------------------------------
 *-- Description： tree list
 *-- MODIFICATION HISTORY (程式內變更記錄)
 *-- Version： 2023.01.001
 *-- Message：
 *--------------------------------------------------------------------------------
 *-- Modifier                    DateTime      Req. Number       Version changed to     Comments
 *-- Developed_By   Upload_By
 *--------------------------------------------------------------------------------
 */
import { Component, OnInit } from '@angular/core';
import { ArrayDataSource } from '@angular/cdk/collections';
import { FlatTreeControl } from '@angular/cdk/tree';
import { Router } from '@angular/router';
import { FlatNode } from './schemas';

export const TREE_DATA: FlatNode[] = [
  {
    id: '',
    name: '一般設定',
    expandable: false,
    level: 0,
    icon: '',
    theme: 'tree-header',
    labelclass: '',
    news: 0,
  },
  {
    id: 'P001',
    name: '商品管理',
    expandable: true,
    level: 0,
    icon: 'ic_cart',
    theme: 'menu',
    labelclass: '',
    news: 0,
  },
  {
    id: 'P002',
    name: '促銷管理',
    expandable: false,
    level: 0,
    icon: 'ic_kanban',
    theme: 'menu',
    labelclass: '',
    news: 0,
  },
  {
    id: 'P003',
    name: '會員管理',
    expandable: true,
    level: 0,
    icon: 'ic_user',
    theme: 'menu',
    labelclass: '',
    news: 0,
  },
  {
    id: 'P004',
    name: '客戶資料管理',
    expandable: false,
    level: 1,
    icon: '',
    theme: 'menu',
    labelclass: 'dot',
    news: 0,
  },
  {
    id: 'P005',
    name: '公司審核',
    expandable: false,
    level: 1,
    icon: '',
    theme: 'menu',
    labelclass: 'dot',
    news: 13,
  },
  {
    id: 'P006',
    name: '使用者審核',
    expandable: false,
    level: 1,
    icon: '',
    theme: 'menu',
    labelclass: 'dot',
    news: 21,
  },
  {
    id: 'P007',
    name: '變更項目審核',
    expandable: false,
    level: 1,
    icon: '',
    theme: 'menu',
    labelclass: 'dot',
    news: 14,
  },
  {
    id: 'P008',
    name: '訪查紀錄',
    expandable: false,
    level: 1,
    icon: '',
    theme: 'menu',
    labelclass: 'dot',
    news: 0,
  },
  {
    id: 'P009',
    name: '客服管理',
    expandable: false,
    level: 0,
    icon: 'ic_chat',
    theme: 'menu',
    labelclass: '',
    news: 0,
  },
  {
    id: '',
    name: '管理設定',
    expandable: false,
    level: 0,
    icon: '',
    theme: 'tree-header',
    labelclass: '',
    news: 0,
  },
  {
    id: 'S001',
    name: '系統管理',
    expandable: true,
    level: 0,
    icon: 'ic_ecommerce',
    theme: 'menu',
    labelclass: '',
    news: 0,
  },
  {
    id: 'S002',
    name: '統計分析',
    expandable: true,
    level: 0,
    icon: 'ic_analytics',
    theme: 'menu',
    labelclass: '',
    news: 0,
  },
];

@Component({
  selector: 'app-tree-list',
  templateUrl: './tree-list.component.html',
  styleUrls: ['./tree-list.component.scss'],
})
export class TreeListComponent implements OnInit {
  clickItem: string = '';

  treeControl = new FlatTreeControl<FlatNode>(
    (node) => node.level,
    (node) => node.expandable
  );

  dataSource = new ArrayDataSource(TREE_DATA);

  constructor(private readonly router: Router) {}

  hasChild = (_: number, node: FlatNode) => node.expandable;

  /** get parent node */
  getParentNode(node: FlatNode) {
    const nodeIndex = TREE_DATA.indexOf(node);

    for (let i = nodeIndex - 1; i >= 0; i--) {
      if (TREE_DATA[i].level === node.level - 1) {
        return TREE_DATA[i];
      }
    }

    return null;
  }

  /** should render */
  shouldRender(node: FlatNode) {
    let parent = this.getParentNode(node);
    while (parent) {
      if (!parent.isExpanded) {
        return false;
      }
      parent = this.getParentNode(parent);
    }
    return true;
  }

  /** confirm click */
  click(node: FlatNode) {
    this.clickItem = node.id;
  }

  ngOnInit(): void {}
}
