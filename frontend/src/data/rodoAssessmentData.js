/**
 * Dane struktury oceny RODO
 * Zawiera wszystkie rozdziały, obszary i wymagania zgodnie ze strukturą bazy danych
 */

const rodoAssessmentData = {
  chapters: [
    {
      id: 1,
      name: "Zasady ogólne",
      description: "Ocena zgodności z ogólnymi zasadami RODO",
      areas: [
        {
          id: 1,
          name: "Zgodność z prawem",
          description: "Ocena zgodności z zasadą legalności przetwarzania",
          requirements: [
            {
              id: 1,
              text: "Czy przetwarzanie danych osobowych odbywa się na podstawie co najmniej jednej z podstaw prawnych określonych w art. 6 RODO?",
              value: null,
              comment: ""
            },
            {
              id: 2,
              text: "Czy w przypadku przetwarzania szczególnych kategorii danych osobowych, spełnione są warunki określone w art. 9 RODO?",
              value: null,
              comment: ""
            },
            {
              id: 3,
              text: "Czy w przypadku przetwarzania danych dotyczących wyroków skazujących i czynów zabronionych, spełnione są warunki określone w art. 10 RODO?",
              value: null,
              comment: ""
            }
          ],
          score: null,
          comment: ""
        },
        {
          id: 2,
          name: "Rzetelność i przejrzystość",
          description: "Ocena zgodności z zasadą rzetelności i przejrzystości",
          requirements: [
            {
              id: 4,
              text: "Czy osoby, których dane dotyczą, są informowane o przetwarzaniu ich danych w sposób przejrzysty, zrozumiały i łatwo dostępny?",
              value: null,
              comment: ""
            },
            {
              id: 5,
              text: "Czy informacje przekazywane osobom, których dane dotyczą, są sformułowane jasnym i prostym językiem?",
              value: null,
              comment: ""
            },
            {
              id: 6,
              text: "Czy administrator danych jest transparentny odnośnie do celów i zakresu przetwarzania danych?",
              value: null,
              comment: ""
            }
          ],
          score: null,
          comment: ""
        },
        {
          id: 3,
          name: "Minimalizacja danych",
          description: "Ocena zgodności z zasadą minimalizacji danych",
          requirements: [
            {
              id: 7,
              text: "Czy przetwarzane są tylko te dane, które są niezbędne do osiągnięcia określonych celów?",
              value: null,
              comment: ""
            },
            {
              id: 8,
              text: "Czy zakres zbieranych danych jest adekwatny do celów przetwarzania?",
              value: null,
              comment: ""
            },
            {
              id: 9,
              text: "Czy istnieją procedury regularnego przeglądu zakresu zbieranych danych pod kątem ich niezbędności?",
              value: null,
              comment: ""
            }
          ],
          score: null,
          comment: ""
        },
        {
          id: 4,
          name: "Prawidłowość danych",
          description: "Ocena zgodności z zasadą prawidłowości danych",
          requirements: [
            {
              id: 10,
              text: "Czy istnieją procedury zapewniające prawidłowość przetwarzanych danych?",
              value: null,
              comment: ""
            },
            {
              id: 11,
              text: "Czy dane są regularnie aktualizowane?",
              value: null,
              comment: ""
            },
            {
              id: 12,
              text: "Czy istnieją procedury usuwania lub korygowania nieprawidłowych danych?",
              value: null,
              comment: ""
            }
          ],
          score: null,
          comment: ""
        },
        {
          id: 5,
          name: "Ograniczenie przechowywania",
          description: "Ocena zgodności z zasadą ograniczenia przechowywania",
          requirements: [
            {
              id: 13,
              text: "Czy określono okresy przechowywania danych dla różnych kategorii danych?",
              value: null,
              comment: ""
            },
            {
              id: 14,
              text: "Czy istnieją procedury regularnego przeglądu przechowywanych danych pod kątem ich dalszej przydatności?",
              value: null,
              comment: ""
            },
            {
              id: 15,
              text: "Czy istnieją procedury usuwania lub anonimizacji danych po upływie okresu ich przechowywania?",
              value: null,
              comment: ""
            }
          ],
          score: null,
          comment: ""
        },
        {
          id: 6,
          name: "Integralność i poufność",
          description: "Ocena zgodności z zasadą integralności i poufności",
          requirements: [
            {
              id: 16,
              text: "Czy wdrożono odpowiednie środki techniczne i organizacyjne zapewniające bezpieczeństwo danych?",
              value: null,
              comment: ""
            },
            {
              id: 17,
              text: "Czy istnieją procedury regularnego testowania, mierzenia i oceniania skuteczności środków bezpieczeństwa?",
              value: null,
              comment: ""
            },
            {
              id: 18,
              text: "Czy pracownicy są regularnie szkoleni w zakresie bezpieczeństwa danych?",
              value: null,
              comment: ""
            }
          ],
          score: null,
          comment: ""
        }
      ]
    },
    {
      id: 2,
      name: "Podstawy przetwarzania",
      description: "Ocena zgodności z podstawami prawnymi przetwarzania danych",
      areas: [
        {
          id: 7,
          name: "Zgoda",
          description: "Ocena zgodności z wymogami dotyczącymi zgody",
          requirements: [
            {
              id: 19,
              text: "Czy zgoda jest wyrażana w sposób dobrowolny, konkretny, świadomy i jednoznaczny?",
              value: null,
              comment: ""
            },
            {
              id: 20,
              text: "Czy zgoda jest dokumentowana i przechowywana w sposób umożliwiający jej weryfikację?",
              value: null,
              comment: ""
            },
            {
              id: 21,
              text: "Czy istnieją procedury umożliwiające wycofanie zgody w dowolnym momencie?",
              value: null,
              comment: ""
            },
            {
              id: 22,
              text: "Czy w przypadku przetwarzania danych dzieci, zgoda jest uzyskiwana od rodziców lub opiekunów prawnych?",
              value: null,
              comment: ""
            }
          ],
          score: null,
          comment: ""
        },
        {
          id: 8,
          name: "Umowa",
          description: "Ocena zgodności z podstawą prawną umowy",
          requirements: [
            {
              id: 23,
              text: "Czy przetwarzanie danych na podstawie umowy jest ograniczone do danych niezbędnych do wykonania umowy?",
              value: null,
              comment: ""
            },
            {
              id: 24,
              text: "Czy w przypadku przetwarzania danych przed zawarciem umowy, przetwarzanie jest ograniczone do działań niezbędnych do zawarcia umowy?",
              value: null,
              comment: ""
            }
          ],
          score: null,
          comment: ""
        },
        {
          id: 9,
          name: "Obowiązek prawny",
          description: "Ocena zgodności z podstawą prawną obowiązku prawnego",
          requirements: [
            {
              id: 25,
              text: "Czy przetwarzanie danych na podstawie obowiązku prawnego jest ograniczone do zakresu wymaganego przez przepisy prawa?",
              value: null,
              comment: ""
            },
            {
              id: 26,
              text: "Czy istnieje dokumentacja identyfikująca konkretne przepisy prawa stanowiące podstawę przetwarzania?",
              value: null,
              comment: ""
            }
          ],
          score: null,
          comment: ""
        },
        {
          id: 10,
          name: "Żywotne interesy",
          description: "Ocena zgodności z podstawą prawną żywotnych interesów",
          requirements: [
            {
              id: 27,
              text: "Czy przetwarzanie danych na podstawie żywotnych interesów jest stosowane tylko w wyjątkowych sytuacjach?",
              value: null,
              comment: ""
            },
            {
              id: 28,
              text: "Czy istnieje dokumentacja uzasadniająca przetwarzanie danych na podstawie żywotnych interesów?",
              value: null,
              comment: ""
            }
          ],
          score: null,
          comment: ""
        },
        {
          id: 11,
          name: "Zadanie publiczne",
          description: "Ocena zgodności z podstawą prawną zadania publicznego",
          requirements: [
            {
              id: 29,
              text: "Czy przetwarzanie danych na podstawie zadania publicznego jest ograniczone do zakresu niezbędnego do wykonania tego zadania?",
              value: null,
              comment: ""
            },
            {
              id: 30,
              text: "Czy istnieje dokumentacja identyfikująca konkretne zadania publiczne stanowiące podstawę przetwarzania?",
              value: null,
              comment: ""
            }
          ],
          score: null,
          comment: ""
        },
        {
          id: 12,
          name: "Prawnie uzasadniony interes",
          description: "Ocena zgodności z podstawą prawną prawnie uzasadnionego interesu",
          requirements: [
            {
              id: 31,
              text: "Czy przeprowadzono test równowagi interesów przed rozpoczęciem przetwarzania danych na podstawie prawnie uzasadnionego interesu?",
              value: null,
              comment: ""
            },
            {
              id: 32,
              text: "Czy istnieje dokumentacja uzasadniająca przetwarzanie danych na podstawie prawnie uzasadnionego interesu?",
              value: null,
              comment: ""
            },
            {
              id: 33,
              text: "Czy osoby, których dane dotyczą, są informowane o przetwarzaniu ich danych na podstawie prawnie uzasadnionego interesu?",
              value: null,
              comment: ""
            }
          ],
          score: null,
          comment: ""
        }
      ]
    },
    {
      id: 3,
      name: "Prawa osób",
      description: "Ocena zgodności z prawami osób, których dane dotyczą",
      areas: [
        {
          id: 13,
          name: "Prawo do informacji",
          description: "Ocena zgodności z prawem do informacji",
          requirements: [
            {
              id: 34,
              text: "Czy osoby, których dane dotyczą, są informowane o tożsamości i danych kontaktowych administratora?",
              value: null,
              comment: ""
            },
            {
              id: 35,
              text: "Czy osoby, których dane dotyczą, są informowane o celach przetwarzania i podstawie prawnej przetwarzania?",
              value: null,
              comment: ""
            },
            {
              id: 36,
              text: "Czy osoby, których dane dotyczą, są informowane o odbiorcach danych?",
              value: null,
              comment: ""
            },
            {
              id: 37,
              text: "Czy osoby, których dane dotyczą, są informowane o okresie przechowywania danych?",
              value: null,
              comment: ""
            },
            {
              id: 38,
              text: "Czy osoby, których dane dotyczą, są informowane o przysługujących im prawach?",
              value: null,
              comment: ""
            }
          ],
          score: null,
          comment: ""
        },
        {
          id: 14,
          name: "Prawo dostępu",
          description: "Ocena zgodności z prawem dostępu do danych",
          requirements: [
            {
              id: 39,
              text: "Czy istnieją procedury umożliwiające osobom, których dane dotyczą, uzyskanie dostępu do ich danych?",
              value: null,
              comment: ""
            },
            {
              id: 40,
              text: "Czy osoby, których dane dotyczą, mogą uzyskać kopię przetwarzanych danych?",
              value: null,
              comment: ""
            },
            {
              id: 41,
              text: "Czy informacje o przetwarzaniu są przekazywane osobom, których dane dotyczą, w zwięzłej, przejrzystej, zrozumiałej i łatwo dostępnej formie?",
              value: null,
              comment: ""
            }
          ],
          score: null,
          comment: ""
        },
        {
          id: 15,
          name: "Prawo do sprostowania",
          description: "Ocena zgodności z prawem do sprostowania danych",
          requirements: [
            {
              id: 42,
              text: "Czy istnieją procedury umożliwiające osobom, których dane dotyczą, sprostowanie nieprawidłowych danych?",
              value: null,
              comment: ""
            },
            {
              id: 43,
              text: "Czy istnieją procedury umożliwiające osobom, których dane dotyczą, uzupełnienie niekompletnych danych?",
              value: null,
              comment: ""
            },
            {
              id: 44,
              text: "Czy sprostowanie danych jest dokonywane bez zbędnej zwłoki?",
              value: null,
              comment: ""
            }
          ],
          score: null,
          comment: ""
        },
        {
          id: 16,
          name: "Prawo do usunięcia",
          description: "Ocena zgodności z prawem do usunięcia danych",
          requirements: [
            {
              id: 45,
              text: "Czy istnieją procedury umożliwiające osobom, których dane dotyczą, usunięcie ich danych w określonych przypadkach?",
              value: null,
              comment: ""
            },
            {
              id: 46,
              text: "Czy usunięcie danych jest dokonywane bez zbędnej zwłoki?",
              value: null,
              comment: ""
            },
            {
              id: 47,
              text: "Czy w przypadku upublicznienia danych, podejmowane są rozsądne działania w celu poinformowania innych administratorów o żądaniu usunięcia danych?",
              value: null,
              comment: ""
            }
          ],
          score: null,
          comment: ""
        },
        {
          id: 17,
          name: "Prawo do ograniczenia",
          description: "Ocena zgodności z prawem do ograniczenia przetwarzania",
          requirements: [
            {
              id: 48,
              text: "Czy istnieją procedury umożliwiające osobom, których dane dotyczą, ograniczenie przetwarzania ich danych w określonych przypadkach?",
              value: null,
              comment: ""
            },
            {
              id: 49,
              text: "Czy w przypadku ograniczenia przetwarzania, dane są przetwarzane wyłącznie za zgodą osoby, której dane dotyczą, lub w celu ustalenia, dochodzenia lub obrony roszczeń?",
              value: null,
              comment: ""
            },
            {
              id: 50,
              text: "Czy osoby, których dane dotyczą, są informowane przed zniesieniem ograniczenia przetwarzania?",
              value: null,
              comment: ""
            }
          ],
          score: null,
          comment: ""
        },
        {
          id: 18,
          name: "Prawo do przenoszenia",
          description: "Ocena zgodności z prawem do przenoszenia danych",
          requirements: [
            {
              id: 51,
              text: "Czy istnieją procedury umożliwiające osobom, których dane dotyczą, otrzymanie ich danych w ustrukturyzowanym, powszechnie używanym formacie nadającym się do odczytu maszynowego?",
              value: null,
              comment: ""
            },
            {
              id: 52,
              text: "Czy istnieją procedury umożliwiające osobom, których dane dotyczą, przesłanie ich danych innemu administratorowi?",
              value: null,
              comment: ""
            },
            {
              id: 53,
              text: "Czy prawo do przenoszenia danych jest realizowane bez uszczerbku dla prawa do usunięcia danych?",
              value: null,
              comment: ""
            }
          ],
          score: null,
          comment: ""
        },
        {
          id: 19,
          name: "Prawo do sprzeciwu",
          description: "Ocena zgodności z prawem do sprzeciwu",
          requirements: [
            {
              id: 54,
              text: "Czy istnieją procedury umożliwiające osobom, których dane dotyczą, wniesienie sprzeciwu wobec przetwarzania ich danych?",
              value: null,
              comment: ""
            },
            {
              id: 55,
              text: "Czy w przypadku wniesienia sprzeciwu, przetwarzanie danych jest zaprzestawane, chyba że istnieją ważne prawnie uzasadnione podstawy do przetwarzania?",
              value: null,
              comment: ""
            },
            {
              id: 56,
              text: "Czy osoby, których dane dotyczą, są informowane o prawie do sprzeciwu w sposób wyraźny i odrębny od innych informacji?",
              value: null,
              comment: ""
            }
          ],
          score: null,
          comment: ""
        }
      ]
    },
    {
      id: 4,
      name: "Obowiązki administratora",
      description: "Ocena zgodności z obowiązkami administratora danych",
      areas: [
        {
          id: 20,
          name: "Rejestr czynności",
          description: "Ocena zgodności z obowiązkiem prowadzenia rejestru czynności przetwarzania",
          requirements: [
            {
              id: 57,
              text: "Czy prowadzony jest rejestr czynności przetwarzania danych?",
              value: null,
              comment: ""
            },
            {
              id: 58,
              text: "Czy rejestr czynności przetwarzania zawiera wszystkie wymagane informacje?",
              value: null,
              comment: ""
            },
            {
              id: 59,
              text: "Czy rejestr czynności przetwarzania jest regularnie aktualizowany?",
              value: null,
              comment: ""
            }
          ],
          score: null,
          comment: ""
        },
        {
          id: 21,
          name: "Privacy by design",
          description: "Ocena zgodności z zasadą privacy by design",
          requirements: [
            {
              id: 60,
              text: "Czy zasada privacy by design jest uwzględniana przy projektowaniu nowych procesów przetwarzania danych?",
              value: null,
              comment: ""
            },
            {
              id: 61,
              text: "Czy wdrożono odpowiednie środki techniczne i organizacyjne w celu skutecznej realizacji zasad ochrony danych?",
              value: null,
              comment: ""
            },
            {
              id: 62,
              text: "Czy zasada privacy by design jest uwzględniana przy aktualizacji istniejących procesów przetwarzania danych?",
              value: null,
              comment: ""
            }
          ],
          score: null,
          comment: ""
        },
        {
          id: 22,
          name: "Privacy by default",
          description: "Ocena zgodności z zasadą privacy by default",
          requirements: [
            {
              id: 63,
              text: "Czy domyślnie przetwarzane są tylko te dane, które są niezbędne dla osiągnięcia określonego celu?",
              value: null,
              comment: ""
            },
            {
              id: 64,
              text: "Czy domyślnie dane są przechowywane przez ograniczony okres?",
              value: null,
              comment: ""
            },
            {
              id: 65,
              text: "Czy domyślnie dostęp do danych jest ograniczony do minimum?",
              value: null,
              comment: ""
            }
          ],
          score: null,
          comment: ""
        },
        {
          id: 23,
          name: "Ocena skutków",
          description: "Ocena zgodności z obowiązkiem przeprowadzania oceny skutków dla ochrony danych",
          requirements: [
            {
              id: 66,
              text: "Czy przeprowadzana jest ocena skutków dla ochrony danych w przypadku operacji przetwarzania, które mogą powodować wysokie ryzyko naruszenia praw i wolności osób fizycznych?",
              value: null,
              comment: ""
            },
            {
              id: 67,
              text: "Czy ocena skutków dla ochrony danych zawiera wszystkie wymagane elementy?",
              value: null,
              comment: ""
            },
            {
              id: 68,
              text: "Czy w przypadku stwierdzenia wysokiego ryzyka, konsultacje z organem nadzorczym są przeprowadzane przed rozpoczęciem przetwarzania?",
              value: null,
              comment: ""
            }
          ],
          score: null,
          comment: ""
        },
        {
          id: 24,
          name: "Inspektor ochrony danych",
          description: "Ocena zgodności z wymogami dotyczącymi inspektora ochrony danych",
          requirements: [
            {
              id: 69,
              text: "Czy wyznaczono inspektora ochrony danych, jeśli jest to wymagane?",
              value: null,
              comment: ""
            },
            {
              id: 70,
              text: "Czy inspektor ochrony danych posiada odpowiednie kwalifikacje?",
              value: null,
              comment: ""
            },
            {
              id: 71,
              text: "Czy inspektor ochrony danych jest właściwie zaangażowany we wszystkie sprawy dotyczące ochrony danych osobowych?",
              value: null,
              comment: ""
            },
            {
              id: 72,
              text: "Czy inspektor ochrony danych ma zapewnioną niezależność w wykonywaniu swoich zadań?",
              value: null,
              comment: ""
            }
          ],
          score: null,
          comment: ""
        },
        {
          id: 25,
          name: "Zgłaszanie naruszeń",
          description: "Ocena zgodności z obowiązkiem zgłaszania naruszeń",
          requirements: [
            {
              id: 73,
              text: "Czy istnieją procedury zgłaszania naruszeń ochrony danych osobowych organowi nadzorczemu?",
              value: null,
              comment: ""
            },
            {
              id: 74,
              text: "Czy naruszenia ochrony danych osobowych są zgłaszane organowi nadzorczemu bez zbędnej zwłoki, w miarę możliwości nie później niż w terminie 72 godzin?",
              value: null,
              comment: ""
            },
            {
              id: 75,
              text: "Czy w przypadku naruszenia ochrony danych osobowych, które może powodować wysokie ryzyko naruszenia praw i wolności osób fizycznych, osoby, których dane dotyczą, są o tym informowane bez zbędnej zwłoki?",
              value: null,
              comment: ""
            },
            {
              id: 76,
              text: "Czy prowadzona jest dokumentacja naruszeń ochrony danych osobowych?",
              value: null,
              comment: ""
            }
          ],
          score: null,
          comment: ""
        }
      ]
    },
    {
      id: 5,
      name: "Bezpieczeństwo danych",
      description: "Ocena zgodności z wymogami bezpieczeństwa danych",
      areas: [
        {
          id: 26,
          name: "Środki techniczne",
          description: "Ocena zgodności z wymogami dotyczącymi środków technicznych",
          requirements: [
            {
              id: 77,
              text: "Czy wdrożono odpowiednie środki techniczne zapewniające bezpieczeństwo danych?",
              value: null,
              comment: ""
            },
            {
              id: 78,
              text: "Czy stosowane są mechanizmy kontroli dostępu do danych?",
              value: null,
              comment: ""
            },
            {
              id: 79,
              text: "Czy stosowane są mechanizmy szyfrowania danych?",
              value: null,
              comment: ""
            },
            {
              id: 80,
              text: "Czy stosowane są mechanizmy tworzenia kopii zapasowych danych?",
              value: null,
              comment: ""
            }
          ],
          score: null,
          comment: ""
        },
        {
          id: 27,
          name: "Środki organizacyjne",
          description: "Ocena zgodności z wymogami dotyczącymi środków organizacyjnych",
          requirements: [
            {
              id: 81,
              text: "Czy wdrożono odpowiednie środki organizacyjne zapewniające bezpieczeństwo danych?",
              value: null,
              comment: ""
            },
            {
              id: 82,
              text: "Czy istnieją procedury nadawania i odbierania uprawnień do przetwarzania danych?",
              value: null,
              comment: ""
            },
            {
              id: 83,
              text: "Czy istnieją procedury szkolenia pracowników w zakresie ochrony danych?",
              value: null,
              comment: ""
            },
            {
              id: 84,
              text: "Czy istnieją procedury audytu wewnętrznego w zakresie ochrony danych?",
              value: null,
              comment: ""
            }
          ],
          score: null,
          comment: ""
        },
        {
          id: 28,
          name: "Pseudonimizacja i szyfrowanie",
          description: "Ocena zgodności z wymogami dotyczącymi pseudonimizacji i szyfrowania",
          requirements: [
            {
              id: 85,
              text: "Czy stosowane są techniki pseudonimizacji danych?",
              value: null,
              comment: ""
            },
            {
              id: 86,
              text: "Czy stosowane są techniki szyfrowania danych?",
              value: null,
              comment: ""
            },
            {
              id: 87,
              text: "Czy klucze szyfrujące są odpowiednio zabezpieczone?",
              value: null,
              comment: ""
            }
          ],
          score: null,
          comment: ""
        },
        {
          id: 29,
          name: "Testowanie zabezpieczeń",
          description: "Ocena zgodności z wymogami dotyczącymi testowania zabezpieczeń",
          requirements: [
            {
              id: 88,
              text: "Czy regularnie przeprowadzane są testy zabezpieczeń?",
              value: null,
              comment: ""
            },
            {
              id: 89,
              text: "Czy przeprowadzane są testy penetracyjne?",
              value: null,
              comment: ""
            },
            {
              id: 90,
              text: "Czy wyniki testów zabezpieczeń są analizowane i wdrażane są odpowiednie działania naprawcze?",
              value: null,
              comment: ""
            }
          ],
          score: null,
          comment: ""
        },
        {
          id: 30,
          name: "Zarządzanie incydentami",
          description: "Ocena zgodności z wymogami dotyczącymi zarządzania incydentami",
          requirements: [
            {
              id: 91,
              text: "Czy istnieją procedury zarządzania incydentami bezpieczeństwa?",
              value: null,
              comment: ""
            },
            {
              id: 92,
              text: "Czy incydenty bezpieczeństwa są odpowiednio dokumentowane?",
              value: null,
              comment: ""
            },
            {
              id: 93,
              text: "Czy po wystąpieniu incydentu bezpieczeństwa przeprowadzana jest analiza przyczyn i wdrażane są działania zapobiegawcze?",
              value: null,
              comment: ""
            }
          ],
          score: null,
          comment: ""
        }
      ]
    },
    {
      id: 6,
      name: "Przekazywanie danych",
      description: "Ocena zgodności z zasadami przekazywania danych",
      areas: [
        {
          id: 31,
          name: "Przekazywanie w UE/EOG",
          description: "Ocena zgodności z zasadami przekazywania danych w UE/EOG",
          requirements: [
            {
              id: 94,
              text: "Czy przekazywanie danych w ramach UE/EOG odbywa się zgodnie z zasadami RODO?",
              value: null,
              comment: ""
            },
            {
              id: 95,
              text: "Czy istnieją umowy powierzenia przetwarzania danych z podmiotami przetwarzającymi dane w UE/EOG?",
              value: null,
              comment: ""
            },
            {
              id: 96,
              text: "Czy umowy powierzenia przetwarzania danych zawierają wszystkie wymagane elementy?",
              value: null,
              comment: ""
            }
          ],
          score: null,
          comment: ""
        },
        {
          id: 32,
          name: "Przekazywanie poza UE/EOG",
          description: "Ocena zgodności z zasadami przekazywania danych poza UE/EOG",
          requirements: [
            {
              id: 97,
              text: "Czy przekazywanie danych poza UE/EOG odbywa się na podstawie decyzji stwierdzającej odpowiedni stopień ochrony, odpowiednich zabezpieczeń lub wyjątków?",
              value: null,
              comment: ""
            },
            {
              id: 98,
              text: "Czy w przypadku przekazywania danych do państw, wobec których Komisja nie wydała decyzji stwierdzającej odpowiedni stopień ochrony, zapewnione są odpowiednie zabezpieczenia?",
              value: null,
              comment: ""
            },
            {
              id: 99,
              text: "Czy osoby, których dane dotyczą, są informowane o zamiarze przekazania danych poza UE/EOG?",
              value: null,
              comment: ""
            }
          ],
          score: null,
          comment: ""
        },
        {
          id: 33,
          name: "Standardowe klauzule umowne",
          description: "Ocena zgodności z wymogami dotyczącymi standardowych klauzul umownych",
          requirements: [
            {
              id: 100,
              text: "Czy w przypadku przekazywania danych poza UE/EOG na podstawie standardowych klauzul umownych, stosowane są klauzule zatwierdzone przez Komisję Europejską?",
              value: null,
              comment: ""
            },
            {
              id: 101,
              text: "Czy standardowe klauzule umowne są stosowane bez modyfikacji?",
              value: null,
              comment: ""
            },
            {
              id: 102,
              text: "Czy przeprowadzana jest ocena, czy prawo państwa trzeciego zapewnia odpowiedni poziom ochrony danych?",
              value: null,
              comment: ""
            }
          ],
          score: null,
          comment: ""
        },
        {
          id: 34,
          name: "Wiążące reguły korporacyjne",
          description: "Ocena zgodności z wymogami dotyczącymi wiążących reguł korporacyjnych",
          requirements: [
            {
              id: 103,
              text: "Czy w przypadku przekazywania danych poza UE/EOG na podstawie wiążących reguł korporacyjnych, reguły te zostały zatwierdzone przez właściwy organ nadzorczy?",
              value: null,
              comment: ""
            },
            {
              id: 104,
              text: "Czy wiążące reguły korporacyjne zawierają wszystkie wymagane elementy?",
              value: null,
              comment: ""
            },
            {
              id: 105,
              text: "Czy wiążące reguły korporacyjne są skutecznie wdrożone w całej grupie przedsiębiorstw?",
              value: null,
              comment: ""
            }
          ],
          score: null,
          comment: ""
        }
      ]
    }
  ]
};

export default rodoAssessmentData;
