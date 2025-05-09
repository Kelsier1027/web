/** Flat node with expandable and level information */
export interface FlatNode {
  id: string;
  expandable: boolean;
  name: string;
  level: number;
  isExpanded?: boolean;
  icon: string;
  theme?: 'menu' | 'tree-header';
  labelclass?: string;
  news: number;
}
