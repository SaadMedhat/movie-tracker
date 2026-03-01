import { parseISO, format, getYear as fnsGetYear } from "date-fns"

export const getYear = (dateString: string): string => {
  if (!dateString) return ""
  return fnsGetYear(parseISO(dateString)).toString()
}

export const formatReleaseDate = (dateString: string): string => {
  if (!dateString) return ""
  return format(parseISO(dateString), "dd MMMM yyyy")
}

export const formatShortDate = (dateString: string): string => {
  if (!dateString) return ""
  return format(parseISO(dateString), "MMM d, yyyy")
}
