require('dotenv').config();

export const configurationEnv = {
  type: {
    report: process.env.TYPE_REPORT ? process.env.TYPE_REPORT : 'ANY',
  },
  parameters: {
    parameterA: process.env.PARAMETER_A ? Number(process.env.PARAMETER_A) : 0,
    parameterB: process.env.PARAMETER_B ? Number(process.env.PARAMETER_B) : 0,
    parameterC: process.env.PARAMETER_C
      ? Boolean(Number(process.env.PARAMETER_C))
      : false,
    parameterD: process.env.PARAMETER_D ? Number(process.env.PARAMETER_D) : 0,
  },
};
