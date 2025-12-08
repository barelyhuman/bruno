import React from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import StyledWrapper from './StyledWrapper';
import { useTheme } from 'providers/Theme';

const themes = [
  {
    key: 'dark',
    label: 'Dark'
  },
  {
    key: 'light',
    label: 'Light'
  },
  {
    key: 'system',
    label: 'System'
  },
  {
    key: 'reaper',
    label: 'Reaper'
  },
  {
    key: 'sequoia',
    label: 'Sequoia'
  }
];

const Theme = () => {
  const { storedTheme, setStoredTheme } = useTheme();

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      theme: storedTheme
    },
    validationSchema: Yup.object({
      theme: Yup.string().oneOf(['light', 'dark', 'reaper', 'system']).required('theme is required')
    }),
    onSubmit: (values) => {
      setStoredTheme(values.theme);
    }
  });

  return (
    <StyledWrapper>
      <div className="bruno-form">
        <div className="flex items-center mt-2">
          {themes.map((d, i) => {
            return (
              <>
                <input
                  id={`${d.key}-theme`}
                  className={`cursor-pointer ${i === 0 ? 'ml-1' : ''}`}
                  type="radio"
                  name="theme"
                  onChange={(e) => {
                    formik.handleChange(e);
                    formik.handleSubmit();
                  }}
                  value={d.key}
                  checked={formik.values.theme === d.key}
                />
                <label htmlFor={`${d.key}-theme`} className="ml-1 mr-2 cursor-pointer select-none">
                  {d.label}
                </label>
              </>
            );
          })}
        </div>
      </div>
    </StyledWrapper>
  );
};

export default Theme;
