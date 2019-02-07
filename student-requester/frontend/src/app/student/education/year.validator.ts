import { AbstractControl } from '@angular/forms'

export function EndYearValidator(control: AbstractControl) {
    if (control && (control.value !== null || control.value !== undefined)) {
        const EndyearValue = control.value;

        const Startyear = control.root.get('Startyear');
        if (Startyear) {
            const StartyearValue = Startyear.value;
            if (StartyearValue >= EndyearValue) {
                return {
                    isError: true
                };
            }
        }
    }
    return null;
}

export function StartYearValidator(control: AbstractControl) {
  if (control && (control.value !== null || control.value !== undefined)) {
      const StartyearValue = control.value;

      const Endyear = control.root.get('Endyear');
      if (Endyear) {
          const EndyearValue = Endyear.value;
          if (EndyearValue <= StartyearValue) {
              return {
                  isError: true
              };
          }
      }
  }
  return null;
}