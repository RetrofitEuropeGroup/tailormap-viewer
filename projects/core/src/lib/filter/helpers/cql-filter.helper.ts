import { FilterGroupModel } from '../models/filter-group.model';
import { AttributeFilterModel } from '../models/attribute-filter.model';
import { FilterConditionEnum } from '../models/filter-condition.enum';
import { FeatureAttributeTypeEnum } from '@tailormap-viewer/api';
import { TypesHelper } from '@tailormap-viewer/shared';

export class CqlFilterHelper {

  public static getFilters(filterGroups: FilterGroupModel[]): Map<number, string> {
    const cqlDict = new Map<number, string>();
    const layerIds = new Set<number>(filterGroups.map(f => f.layerId));
    layerIds.forEach(layerId => {
      const filtersForLayer = filterGroups.filter(f => f.layerId === layerId);
      cqlDict.set(layerId, CqlFilterHelper.getFilterForLayer(filtersForLayer));
    });
    return cqlDict;
  }

  public static getFilterForLayer(filterGroups: FilterGroupModel[]): string {
    const rootFilterGroups = filterGroups.filter(f => (typeof f.parentGroup === 'undefined' || f.parentGroup === null));
    return rootFilterGroups.map(f => CqlFilterHelper.getFilterForGroup(f, filterGroups)).join(' AND ');
  }

  private static getFilterForGroup(filterGroup: FilterGroupModel, allFilterGroups: FilterGroupModel[]): string {
    const filter: string[] = [];
    const baseFilter: string[] = filterGroup.filters
      .map(f => CqlFilterHelper.convertFilterToQuery(f))
      .filter(TypesHelper.isDefined);
    filter.push(CqlFilterHelper.wrapFilters(baseFilter, filterGroup.operator));
    const childFilters = allFilterGroups.filter(f => f.parentGroup === filterGroup.id);
    if (childFilters.length > 0) {
      const childCql = childFilters.map(f => CqlFilterHelper.getFilterForGroup(f, allFilterGroups));
      filter.push(CqlFilterHelper.wrapFilters(childCql, filterGroup.operator));
    }
    return CqlFilterHelper.wrapFilters(filter, filterGroup.operator);
  }

  private static convertFilterToQuery(filter: AttributeFilterModel): string | null {
    if (filter.condition === FilterConditionEnum.UNIQUE_VALUES_KEY) {
      const uniqueValList = filter.value.map(v => CqlFilterHelper.getExpression(v, filter.attributeType)).join(',');
      return CqlFilterHelper.wrapFilter(`${filter.attribute} IN (${uniqueValList})`);
    }
    if (filter.condition === FilterConditionEnum.NULL_KEY) {
      return CqlFilterHelper.wrapFilter(`${filter.attribute} IS${filter.invertCondition ? ' NOT' : ''} NULL`);
    }
    const value = filter.value[0];
    if (CqlFilterHelper.isNumeric(filter.attributeType)
      && filter.condition === FilterConditionEnum.NUMBER_BETWEEN_KEY
      && filter.value.length > 1) {
      return CqlFilterHelper.wrapFilter(`${filter.attribute} BETWEEN ${filter.value[0]} AND ${filter.value[1]}`);
    }
    if (CqlFilterHelper.isNumeric(filter.attributeType)) {
      return CqlFilterHelper.wrapFilter(`${filter.attribute} ${filter.condition} ${value}`);
    }
    if (filter.attributeType === FeatureAttributeTypeEnum.STRING) {
      return CqlFilterHelper.wrapFilter(CqlFilterHelper.getQueryForString(filter));
    }
    if (filter.attributeType === FeatureAttributeTypeEnum.DATE
      && filter.condition === FilterConditionEnum.DATE_BETWEEN_KEY
      && filter.value.length > 1) {
      const dateFrom = filter.value[0];
      const dateUntil = filter.value[1];
      return CqlFilterHelper.wrapFilter(`${filter.attribute} BETWEEN ${dateFrom} AND ${dateUntil}`);
    }
    if (filter.attributeType === FeatureAttributeTypeEnum.DATE) {
      const cond = filter.condition === FilterConditionEnum.DATE_ON_KEY ? '=' : filter.condition === 'AFTER' ? '>' : '<';
      return CqlFilterHelper.wrapFilter(`${filter.attribute} ${cond} ${value}`);
    }
    if (filter.attributeType === FeatureAttributeTypeEnum.BOOLEAN) {
      return CqlFilterHelper.wrapFilter(`${filter.attribute} = ${filter.condition === FilterConditionEnum.BOOLEAN_TRUE_KEY ? 'true' : 'false'}`);
    }
    return null;
  }

  private static wrapFilter(cql: string) {
    return `(${cql})`;
  }

  private static wrapFilters(cqlFilters: string[], operator: 'AND' | 'OR') {
    return cqlFilters.length === 1
      ? cqlFilters[0]
      : CqlFilterHelper.wrapFilter(cqlFilters.join(` ${operator} `));
  }

  private static getQueryForString(filter: AttributeFilterModel) {
    const query: string[] = [filter.attribute];
    const value = filter.value[0];
    if (filter.invertCondition) {
      query.push('NOT');
    }
    query.push(filter.caseSensitive ? 'LIKE' : 'ILIKE');
    if (filter.condition === FilterConditionEnum.STRING_EQUALS_KEY) {
      query.push(CqlFilterHelper.getExpression(`${value}`, FeatureAttributeTypeEnum.STRING));
    }
    if (filter.condition === FilterConditionEnum.STRING_LIKE_KEY) {
      query.push(CqlFilterHelper.getExpression(`%${value}%`, FeatureAttributeTypeEnum.STRING));
    }
    if (filter.condition === FilterConditionEnum.STRING_STARTS_WITH_KEY) {
      query.push(CqlFilterHelper.getExpression(`${value}%`, FeatureAttributeTypeEnum.STRING));
    }
    if (filter.condition === FilterConditionEnum.STRING_ENDS_WITH_KEY) {
      query.push(CqlFilterHelper.getExpression(`%${value}`, FeatureAttributeTypeEnum.STRING));
    }
    return `${query.join(' ')}`;
  }

  public static getExpression(value: string | number | boolean, attributeType: FeatureAttributeTypeEnum): string {
    if (attributeType === FeatureAttributeTypeEnum.STRING || attributeType === FeatureAttributeTypeEnum.DATE) {
      if (typeof value === 'string') {
        value = value.replace(/'/g, '\'\'');
      }
      return `'${value}'`;
    }
    return `${value}`;
  }

  private static isNumeric(attributeType: FeatureAttributeTypeEnum) {
    return attributeType === FeatureAttributeTypeEnum.DOUBLE || attributeType === FeatureAttributeTypeEnum.INTEGER;
  }

}