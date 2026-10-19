import {
  AfterViewInit,
  Directive,
  ElementRef,
  forwardRef,
  inject,
  Input,
  NgZone,
  OnChanges,
  OnDestroy,
  SimpleChanges,
} from "@angular/core";
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from "@angular/forms";
import flatpickr from 'flatpickr';
import { French } from "flatpickr/dist/l10n/fr.js";

@Directive({
  selector: "input[appDatePicker]",
  standalone: true,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => DatePickerDirective),
      multi: true,
    },
  ],
})
export class DatePickerDirective
  implements AfterViewInit, ControlValueAccessor, OnChanges, OnDestroy
{
  @Input() minDate: string | null = null;
  @Input() maxDate: string | null = null;

  private readonly element = inject(ElementRef<HTMLInputElement>);
  private readonly zone = inject(NgZone);
  private picker?: flatpickr.Instance;
  private value = "";
  private changeValue: (value: string) => void = () => {};
  private touchValue: () => void = () => {};

  ngAfterViewInit(): void {
    const input = this.element.nativeElement;
    this.picker = flatpickr(input, {
      locale: French,
      dateFormat: "Y-m-d",
      altInput: true,
      altInputClass: "date-input",
      altFormat: "d/m/Y",
      disableMobile: true,
      allowInput: false,
      minDate: this.minDate ?? undefined,
      maxDate: this.maxDate ?? undefined,
      defaultDate: this.value || undefined,
      onChange: (_dates, value) => {
        this.zone.run(() => {
          this.value = value;
          this.changeValue(value);
          this.touchValue();
        });
      },
      onClose: () => this.zone.run(() => this.touchValue()),
    });

    const accessibleName = input.getAttribute("aria-label");
    if (accessibleName && this.picker.altInput) {
      this.picker.altInput.setAttribute("aria-label", accessibleName);
      this.picker.altInput.setAttribute("autocomplete", "off");
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (!this.picker) return;
    if (changes["minDate"])
      this.picker.set("minDate", this.minDate ?? undefined);
    if (changes["maxDate"])
      this.picker.set("maxDate", this.maxDate ?? undefined);
  }

  writeValue(value: unknown): void {
    this.value = typeof value === "string" ? value.slice(0, 10) : "";
    if (!this.picker) return;
    if (this.value) this.picker.setDate(this.value, false, "Y-m-d");
    else this.picker.clear(false);
  }

  registerOnChange(fn: (value: string) => void): void {
    this.changeValue = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.touchValue = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.element.nativeElement.disabled = isDisabled;
    if (this.picker?.altInput) this.picker.altInput.disabled = isDisabled;
  }

  ngOnDestroy(): void {
    this.picker?.destroy();
  }
}
