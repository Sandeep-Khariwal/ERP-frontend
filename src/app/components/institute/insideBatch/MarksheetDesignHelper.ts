import {
  createMarksheetPdf,
  createCombinedMarksheetPdf,
 
} from "./CreateMarksheetPdf";
import { generateAnnualMarksheet1, generateMidTermMarksheet1 } from "./CreateMarksheetPdf1";
import { generateAnnualMarksheet2, generateMidTermMarksheet2 } from "./CreateMarksheetPdf2";
import { generateAnnualMarksheet3, generateMidTermMarksheet3 } from "./CreateMarksheetPdf3";

// Mid Term design selector
export const getMidTermMarksheetHtml = (
  data: any,
  designId: string,
): string => {
  switch (designId) {
    case "temp_1mid":
      return createMarksheetPdf(data);

    case "temp_2mid":
      return generateMidTermMarksheet1(data);
      
       case "temp_3mid":
      return generateMidTermMarksheet2(data);

      case "temp_4mid":
      return generateMidTermMarksheet3(data);

    default:
      return "";
  }
};

// Annual Term design selector
export const getAnnualTermMarksheetHtml = (
  term1: any,
  term2: any,
  designId: string,
): string => {
  switch (designId) {
    case "temp_1annual":
      return createCombinedMarksheetPdf(term1, term2);

    case "temp_2annual":
      return generateAnnualMarksheet1(term1, term2);

      case "temp_3annual":
      return generateAnnualMarksheet2(term1, term2);

       case "temp_4annual":
      return generateAnnualMarksheet3(term1, term2);

    default:
      return "";
  }
};