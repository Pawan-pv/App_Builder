// src/builders/index.ts (or widget-registry file)
import { TextBuilder } from './primitives/TextBuilder';
import { ButtonBuilder } from './primitives/ButtonBuilder';
import { ImageBuilder } from './primitives/ImageBuilder';
import { InputBuilder } from './primitives/InputBuilder';
import { ColumnBuilder } from './layout/ColumnBuilder';
import { RowBuilder } from './layout/RowBuilder';
import { ContainerBuilder } from './layout/ContainerBuilder';
import { CardBuilder } from './layout/CardBuilder';
import { ListViewBuilder } from './data/ListViewBuilder';
import { GridViewBuilder } from './data/GridViewBuilder';

export const WIDGET_BUILDERS = {
    Text: TextBuilder,
    Button: ButtonBuilder,
    Image: ImageBuilder,
    Input: InputBuilder,
    Column: ColumnBuilder,
    Row: RowBuilder,
    Container: ContainerBuilder,
    Card: CardBuilder,
    ListView: ListViewBuilder,
    GridView: GridViewBuilder,
};