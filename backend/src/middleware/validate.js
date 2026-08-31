import Joi from "joi";

export const applicationSchema = Joi.object({
  fullName: Joi.string().trim().min(2).max(120).required(),
  monthlyIncome: Joi.number().positive().required(),
  creditScore: Joi.number().integer().min(300).max(850).required(),
  taxFiled: Joi.boolean().required(),
  annualTaxPaid: Joi.number().min(0).default(0),
  requestedLoanAmount: Joi.number().positive().required(),
  existingMonthlyDebt: Joi.number().min(0).default(0),
  employmentType: Joi.string().valid("salaried", "self_employed", "unemployed").required(),
  employmentYears: Joi.number().min(0).max(60).required(),
});

export function validateApplication(req, res, next) {
  const { error, value } = applicationSchema.validate(req.body, { abortEarly: false });
  if (error) {
    return res.status(400).json({
      message: "Validation failed",
      details: error.details.map((d) => d.message),
    });
  }
  req.body = value;
  next();
}
