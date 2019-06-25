import * as React from 'React';
import classNames from 'classnames';
import Icon from '../icon';
import CSSMotion from 'rc-animate/lib/CSSMotion';
import Col, { ColProps } from '../grid/col';
import { ValidateStatus } from './FormItem';
import { FormContext, FormContextProps } from './context';

interface FormItemInputMiscProps {
  prefixCls: string;
  children: React.ReactNode;
  errors: string[];
  touched: boolean;
  validating: boolean;
  hasFeedback?: boolean;
  validateStatus?: ValidateStatus;
  onDomErrorVisibleChange: (visible: boolean) => void;
}

export interface FormItemInputProps {
  wrapperCol?: ColProps;
}

function getIconType(validateStatus?: ValidateStatus) {
  switch (validateStatus) {
    case 'success':
      return 'check-circle';
    case 'warning':
      return 'exclamation-circle';
    case 'error':
      return 'close-circle';
    case 'validating':
      return 'loading';
    default:
      return '';
  }
}

const FormItemInput: React.FC<FormItemInputProps & FormItemInputMiscProps> = ({
  prefixCls,
  wrapperCol,
  children,
  errors,
  onDomErrorVisibleChange,
  hasFeedback,
  validateStatus,
}) => {
  const baseClassName = `${prefixCls}-item-control`;

  const { wrapperCol: contextWrapperCol, vertical }: FormContextProps = React.useContext(
    FormContext,
  );

  const mergedWrapperCol: ColProps = wrapperCol || contextWrapperCol || {};

  const className = classNames(baseClassName, mergedWrapperCol.className);

  // To keep animation don't miss error message. We should cache the errors.
  const [cacheErrors, setCacheErrors] = React.useState(errors);
  React.useEffect(() => {
    if (errors.length) {
      setCacheErrors(errors);
      onDomErrorVisibleChange(true);
    }
  }, [errors]);

  // Should provides additional icon if `hasFeedback`
  const iconType = getIconType(validateStatus);
  const icon =
    hasFeedback && iconType ? (
      <span className={`${prefixCls}-item-children-icon`}>
        <Icon type={iconType} theme={iconType === 'loading' ? 'outlined' : 'filled'} />
      </span>
    ) : null;

  // No pass FormContext since it's useless
  return (
    <FormContext.Provider value={{ vertical }}>
      <Col {...mergedWrapperCol} className={className}>
        <div className={`${baseClassName}-input`}>
          {children}
          {icon}
        </div>
        <CSSMotion
          visible={!!errors.length}
          motionName="show-help"
          onLeaveEnd={() => {
            onDomErrorVisibleChange(false);
          }}
          motionAppear
          removeOnLeave
        >
          {({ className }: { className: string }) => {
            return (
              <div className={classNames(`${prefixCls}-item-explain`, className)} key="help">
                {cacheErrors}
              </div>
            );
          }}
        </CSSMotion>
        {/* <div className={`${baseClassName}-message`}>233</div> */}
      </Col>
    </FormContext.Provider>
  );
};

export default FormItemInput;
