type ValidationIssue = {
  message?: string
  instancePath?: string
  keyword?: string
  params?: Record<string, unknown>
}

type ParsedValidationErrors = string[]

export function parseValidationErrors(
  issues: ValidationIssue[],
): ParsedValidationErrors {
  return issues.reduce<ParsedValidationErrors>((acc, issue) => {
    const field = issue.instancePath?.replace(/^\//, '') || 'unknown'
    acc.push(`${field}:${issue.message?.replace('Invalid input: ', ' ')}`)
    return acc
  }, [])
}
