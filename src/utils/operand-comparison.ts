export enum Op {
  eq = 'EQUAL',
  lte = 'LOWER_THAN',
  gte = 'GREATER_THAN',
  eqLte = 'EQUAL_LOWER_THAN',
  eqGte = 'EQUAL_GREATER_THAN',
}

export class OperandComparison {
  public static compareOne(param1: any, operand: Op, param2: any) {
    switch (operand) {
      case Op.eq:
        return param1 == param2;
      case Op.eqLte:
        return param1 <= param2;
      case Op.eqGte:
        return param1 >= param2;
      case Op.lte:
        return param1 < param2;
      case Op.gte:
        return param1 > param2;
      default:
        return false;
    }
  }
}
